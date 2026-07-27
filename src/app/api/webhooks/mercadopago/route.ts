import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Payment } from "mercadopago";
import { mercadopago } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase/server";

const STATUS_MAP: Record<string, "paid" | "rejected" | "cancelled" | "pending"> = {
  approved: "paid",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "cancelled",
  charged_back: "cancelled",
  in_process: "pending",
  pending: "pending",
};

function isValidSignature(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  // Not configured yet (e.g. local dev before the webhook URL exists) - allow
  // through so the flow can still be exercised, but never skip this in production.
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    })
  );
  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
}

export async function POST(request: Request) {
  const url = new URL(request.url);

  let body: { type?: string; data?: { id?: string } } = {};
  try {
    body = await request.json();
  } catch {
    // Some notifications arrive with an empty body; data comes via query params instead.
  }

  const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true });
  }

  if (!isValidSignature(request, dataId)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payment;
  try {
    payment = await new Payment(mercadopago).get({ id: dataId });
  } catch {
    // Unknown/invalid payment id - nothing we can do, acknowledge so
    // Mercado Pago stops retrying this notification.
    return NextResponse.json({ received: true });
  }

  const orderId = payment.external_reference;
  const status = STATUS_MAP[payment.status ?? ""] ?? "pending";

  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .maybeSingle();

  // Unknown order, or already processed - avoids double stock decrement on
  // Mercado Pago's webhook retries (they resend until they get a 2xx).
  if (!order || order.status === "paid") {
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin
    .from("orders")
    .update({
      status,
      mp_payment_id: String(payment.id),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (status === "paid") {
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_id, size, quantity")
      .eq("order_id", orderId);

    for (const item of items ?? []) {
      if (!item.product_id) continue;
      await supabaseAdmin.rpc("decrement_stock", {
        p_product_id: item.product_id,
        p_size: item.size,
        p_quantity: item.quantity,
      });
    }
  }

  return NextResponse.json({ received: true });
}
