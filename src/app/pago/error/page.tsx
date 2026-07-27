import Link from "next/link";

export default function PagoErrorPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">El pago no se pudo procesar</h1>
      <p className="mt-3 text-sm text-foreground/70">
        No te preocupes, no se realizó ningún cobro. Podés volver al carrito e
        intentar de nuevo.
      </p>
      <Link
        href="/carrito"
        className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Volver al carrito
      </Link>
    </div>
  );
}
