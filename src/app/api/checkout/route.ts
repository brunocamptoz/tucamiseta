import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mercadopago } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { CartItem } from "@/types/product";

const CURRENCY = "UYU";

export async function POST(request: Request) {
  const { items } = (await request.json()) as { items: CartItem[] };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select("id, team, price, product_stock(size, stock)")
    .in("id", productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Producto no encontrado: ${item.team}` },
        { status: 400 }
      );
    }
    const stockRow = product.product_stock.find((s) => s.size === item.size);
    if (!stockRow || stockRow.stock < item.quantity) {
      return NextResponse.json(
        { error: `Sin stock suficiente: ${item.team} talle ${item.size}` },
        { status: 400 }
      );
    }
  }

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({ total, status: "pending" })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      order_id: order.id,
      product_id: item.productId,
      team: item.team,
      variant: item.variant,
      player_name: item.playerName ?? null,
      player_number: item.playerNumber ?? null,
      size: item.size,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Mercado Pago only accepts auto_return with a publicly reachable https
  // back_urls.success (it rejects localhost) - skip it in local dev.
  const isPublicUrl = siteUrl.startsWith("https://");

  const preference = new Preference(mercadopago);

  try {
    const result = await preference.create({
      body: {
        items: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            id: `${item.productId}-${item.size}`,
            title: `${item.team}${item.playerName ? ` - ${item.playerName} ${item.playerNumber}` : ""} (Talle ${item.size})`,
            quantity: item.quantity,
            unit_price: product.price,
            currency_id: CURRENCY,
          };
        }),
        external_reference: order.id,
        back_urls: {
          success: `${siteUrl}/pago/exito`,
          failure: `${siteUrl}/pago/error`,
          pending: `${siteUrl}/pago/pendiente`,
        },
        ...(isPublicUrl ? { auto_return: "approved" as const } : {}),
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      },
    });

    const initPoint = result.sandbox_init_point ?? result.init_point;

    return NextResponse.json({ initPoint, orderId: order.id });
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "No se pudo crear la preferencia de pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
