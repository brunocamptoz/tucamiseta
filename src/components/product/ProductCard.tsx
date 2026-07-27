import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-md border border-border"
    >
      <ProductImage product={product} />
      <div className="space-y-1 p-3">
        <p className="text-sm font-medium group-hover:text-primary">
          {product.team}
          {product.playerName ? ` · ${product.playerName} ${product.playerNumber}` : ""}
        </p>
        <p className="text-xs text-foreground/60">{product.variant}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          <span className="text-xs text-foreground/50">
            {product.sizes.join(" / ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
