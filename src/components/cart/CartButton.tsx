"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrito"
      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
    >
      Carrito
      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
        {itemCount}
      </span>
    </Link>
  );
}
