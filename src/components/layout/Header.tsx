import Link from "next/link";
import CartButton from "@/components/cart/CartButton";
import Logo from "@/components/layout/Logo";

const categories = [
  { label: "Selecciones", href: "/categoria/selecciones" },
  { label: "Clubes", href: "/categoria/clubes" },
  { label: "Retro", href: "/categoria/retro" },
];

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Logo size={36} />
          TuCamisetaUy
        </Link>

        <nav className="hidden gap-6 md:flex">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary"
            >
              {category.label}
            </Link>
          ))}
        </nav>

        <CartButton />
      </div>
    </header>
  );
}
