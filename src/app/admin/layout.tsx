import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b border-border bg-muted">
        <div className="mx-auto flex max-w-4xl gap-6 px-4 py-3">
          <Link href="/admin/pedidos" className="text-sm font-medium hover:text-primary">
            Pedidos
          </Link>
          <Link href="/admin/productos" className="text-sm font-medium hover:text-primary">
            Productos y stock
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
