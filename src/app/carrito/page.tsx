"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, removeItem, setQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }
      window.location.href = data.initPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-foreground/70">Tu carrito está vacío.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Carrito</h1>

      <div className="mt-6 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-4 py-4"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.team}
                {item.playerName ? ` · ${item.playerName} ${item.playerNumber}` : ""}
              </p>
              <p className="text-xs text-foreground/60">
                {item.variant} · Talle {item.size}
              </p>
              <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    item.productId,
                    item.size,
                    Math.max(1, item.quantity - 1)
                  )
                }
                className="h-8 w-8 rounded-md border border-border text-sm font-medium hover:border-primary"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(item.productId, item.size, item.quantity + 1)
                }
                className="h-8 w-8 rounded-md border border-border text-sm font-medium hover:border-primary"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.productId, item.size)}
              className="text-xs text-foreground/50 hover:text-red-600"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium">Total</span>
        <span className="text-lg font-bold">{formatPrice(total)}</span>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Redirigiendo..." : "Iniciar pago"}
      </button>
      <p className="mt-3 text-center text-xs text-foreground/60">
        🔒 Pago seguro con Mercado Pago
      </p>
    </div>
  );
}
