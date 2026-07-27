import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-lg bg-primary px-8 py-16 text-primary-foreground">
        <h1 className="max-w-xl text-3xl font-bold sm:text-4xl">
          La colección 2026 ya está acá
        </h1>
        <p className="mt-3 max-w-md text-primary-foreground/90">
          Selecciones, clubes y camisetas retro con envío a todo el país.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Productos destacados</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
