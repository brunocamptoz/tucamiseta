-- Descuento atómico de stock, usado por el webhook de Mercado Pago al confirmar un pago.
-- Ejecutar en Supabase: Dashboard > SQL Editor > New query > Run

create or replace function decrement_stock(p_product_id uuid, p_size text, p_quantity int)
returns void
language sql
as $$
  update product_stock
  set stock = greatest(stock - p_quantity, 0)
  where product_id = p_product_id and size = p_size;
$$;
