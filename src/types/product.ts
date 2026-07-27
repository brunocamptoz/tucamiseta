export type Category = "selecciones" | "clubes" | "retro";

export type Product = {
  id: string;
  slug: string;
  team: string;
  category: Category;
  variant: string;
  image: string;
  playerName?: string;
  playerNumber?: number;
  price: number;
  sizes: string[];
  stock: Record<string, number>;
};

export type CartItem = {
  productId: string;
  slug: string;
  team: string;
  variant: string;
  playerName?: string;
  playerNumber?: number;
  size: string;
  price: number;
  quantity: number;
};
