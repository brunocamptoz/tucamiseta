import Link from "next/link";

export default function PagoPendientePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Tu pago está pendiente</h1>
      <p className="mt-3 text-sm text-foreground/70">
        Te vamos a avisar por email en cuanto se confirme (por ejemplo, si
        elegiste pagar en efectivo).
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
