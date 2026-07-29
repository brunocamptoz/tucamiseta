"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

async function assertAdmin() {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) {
    throw new Error("Panel de administración no configurado");
  }

  const authHeader = (await headers()).get("authorization");
  const [scheme, encoded] = authHeader?.split(" ") ?? [];
  if (scheme !== "Basic" || !encoded) {
    throw new Error("No autorizado");
  }

  const [reqUser, reqPassword] = atob(encoded).split(":");
  if (reqUser !== user || reqPassword !== password) {
    throw new Error("No autorizado");
  }
}

export async function updateProduct(formData: FormData) {
  await assertAdmin();

  const productId = String(formData.get("productId") ?? "");
  const price = Number(formData.get("price"));
  if (!productId || Number.isNaN(price)) return;

  await supabaseAdmin.from("products").update({ price }).eq("id", productId);

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("stock__")) continue;
    const size = key.slice("stock__".length);
    const stock = Number(value);
    if (!size || Number.isNaN(stock)) continue;

    await supabaseAdmin
      .from("product_stock")
      .update({ stock })
      .eq("product_id", productId)
      .eq("size", size);
  }

  revalidatePath("/admin/productos");
}
