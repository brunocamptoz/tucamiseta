import Link from "next/link";
import ClearCartOnSuccess from "@/components/cart/ClearCartOnSuccess";

export default async function PagoExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string }>;
}) {
  const { payment_id } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <ClearCartOnSuccess />
      <h1 className="text-2xl font-bold text-primary">¡Pago aprobado!</h1>
      <p className="mt-3 text-sm text-foreground/70">
        Gracias por tu compra. Te vamos a avisar por email cuando despachemos tu
        pedido.
      </p>
      {payment_id && (
        <p className="mt-4 text-xs text-foreground/50">N° de pago: {payment_id}</p>
      )}
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
