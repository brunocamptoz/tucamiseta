import { supabaseAdmin } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type OrderItem = {
  id: string;
  team: string;
  variant: string;
  player_name: string | null;
  player_number: number | null;
  size: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  status: "pending" | "paid" | "rejected" | "cancelled";
  customer_email: string | null;
  total: number;
  mp_payment_id: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const statusLabels: Record<Order["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
};

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-muted text-foreground/70",
  paid: "bg-primary text-primary-foreground",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-muted text-foreground/50",
};

export default async function AdminPedidosPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, status, customer_email, total, mp_payment_id, created_at, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-xl font-semibold">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/60">Todavía no hay pedidos.</p>
      ) : (
        <div className="mt-6 divide-y divide-border border-y border-border">
          {(orders as Order[]).map((order) => (
            <div key={order.id} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-foreground/50">{order.id}</p>
                  <p className="text-sm text-foreground/70">
                    {new Date(order.created_at).toLocaleString("es-UY")}
                    {order.customer_email ? ` · ${order.customer_email}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="text-foreground/80">
                    {item.quantity}x {item.team}
                    {item.player_name ? ` · ${item.player_name} ${item.player_number}` : ""} (
                    {item.variant}, talle {item.size}) — {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>

              <p className="mt-2 text-sm font-semibold">Total: {formatPrice(order.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
