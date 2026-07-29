import { supabaseAdmin } from "@/lib/supabase/server";
import { updateProduct } from "./actions";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  team: string;
  variant: string;
  player_name: string | null;
  player_number: number | null;
  price: number;
  product_stock: { size: string; stock: number }[];
};

export default async function AdminProductosPage() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, team, variant, player_name, player_number, price, product_stock(size, stock)")
    .order("team");

  if (error) {
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Productos y stock</h1>

      <div className="mt-6 space-y-6">
        {(products as ProductRow[]).map((product) => (
          <form
            key={product.id}
            action={updateProduct}
            className="rounded-md border border-border p-4"
          >
            <input type="hidden" name="productId" value={product.id} />

            <p className="font-medium">
              {product.team}
              {product.player_name
                ? ` · ${product.player_name} ${product.player_number}`
                : ""}
            </p>
            <p className="text-xs text-foreground/60">{product.variant}</p>

            <label className="mt-3 block text-sm">
              Precio
              <input
                type="number"
                name="price"
                defaultValue={product.price}
                className="ml-2 w-28 rounded-md border border-border px-2 py-1"
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-4">
              {product.product_stock.map((s) => (
                <label key={s.size} className="text-sm">
                  Talle {s.size}
                  <input
                    type="number"
                    name={`stock__${s.size}`}
                    defaultValue={s.stock}
                    className="ml-2 w-20 rounded-md border border-border px-2 py-1"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Guardar
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
