"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import ProductImage from "./ProductImage";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const maxStock = product.stock[size] ?? 0;

  function handleSizeChange(nextSize: string) {
    setSize(nextSize);
    setQuantity(1);
    setAdded(false);
  }

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      team: product.team,
      variant: product.variant,
      playerName: product.playerName,
      playerNumber: product.playerNumber,
      size,
      price: product.price,
      quantity,
    });
    setAdded(true);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-10 sm:grid-cols-2">
      <ProductImage product={product} />

      <div>
        <h1 className="text-2xl font-bold">
          {product.team}
          {product.playerName ? ` · ${product.playerName} ${product.playerNumber}` : ""}
        </h1>
        <p className="mt-1 text-sm text-foreground/60">{product.variant}</p>
        <p className="mt-4 text-xl font-semibold">{formatPrice(product.price)}</p>

        <div className="mt-6">
          <p className="text-sm font-medium">Talle</p>
          <div className="mt-2 flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSizeChange(s)}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  s === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium">Cantidad</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 rounded-md border border-border text-sm font-medium hover:border-primary"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="h-8 w-8 rounded-md border border-border text-sm font-medium hover:border-primary"
            >
              +
            </button>
            <span className="text-xs text-foreground/50">
              {maxStock} disponibles
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={maxStock === 0}
          className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {added ? "Agregado ✓" : "Agregar al carrito"}
        </button>

        <p className="mt-3 text-center text-xs text-foreground/60">
          🔒 Pago seguro con Mercado Pago
        </p>
      </div>
    </div>
  );
}
