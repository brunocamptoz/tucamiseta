import { supabase } from "@/lib/supabase/client";
import type { Category, Product } from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  team: string;
  category: Category;
  variant: string;
  player_name: string | null;
  player_number: number | null;
  price: number;
  image: string;
  product_stock: { size: string; stock: number }[];
};

const PRODUCT_SELECT = "*, product_stock(size, stock)";

function toProduct(row: ProductRow): Product {
  const stock = Object.fromEntries(
    row.product_stock.map(({ size, stock }) => [size, stock])
  );
  return {
    id: row.id,
    slug: row.slug,
    team: row.team,
    category: row.category,
    variant: row.variant,
    playerName: row.player_name ?? undefined,
    playerNumber: row.player_number ?? undefined,
    price: row.price,
    image: row.image,
    sizes: row.product_stock.map(({ size }) => size),
    stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? toProduct(data as ProductRow) : undefined;
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category", category)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}
