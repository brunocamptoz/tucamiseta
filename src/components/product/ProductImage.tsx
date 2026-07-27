import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-border bg-muted">
      <Image
        src={product.image}
        alt={`Camiseta ${product.team}${product.playerName ? ` - ${product.playerName} ${product.playerNumber}` : ""}`}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-cover"
      />
    </div>
  );
}
