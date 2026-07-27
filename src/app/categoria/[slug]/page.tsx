import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import type { Category } from "@/types/product";

const categoryLabels: Record<Category, string> = {
  selecciones: "Selecciones",
  clubes: "Clubes",
  retro: "Retro",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = categoryLabels[slug as Category] ?? slug;
  const products = await getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-xl font-semibold">{label}</h1>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/60">
          Todavía no hay productos en esta categoría.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
