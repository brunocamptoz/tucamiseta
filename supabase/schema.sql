-- Camisetas10: esquema inicial (productos, stock por talle, pedidos)
-- Ejecutar este script completo en Supabase: Dashboard > SQL Editor > New query > Run

create extension if not exists "pgcrypto";

-- Productos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  team text not null,
  category text not null check (category in ('selecciones', 'clubes', 'retro')),
  variant text not null,
  player_name text,
  player_number int,
  price integer not null,
  image text not null,
  created_at timestamptz not null default now()
);

-- Stock disponible por talle
create table if not exists product_stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0,
  unique (product_id, size)
);

-- Pedidos
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected', 'cancelled')),
  customer_name text,
  customer_email text,
  customer_phone text,
  total integer not null,
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Items de cada pedido (con snapshot de precio/producto al momento de la compra)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  team text not null,
  variant text not null,
  player_name text,
  player_number int,
  size text not null,
  price integer not null,
  quantity integer not null
);

-- Row Level Security
alter table products enable row level security;
alter table product_stock enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- El catálogo es público (lectura). Los pedidos NO son legibles/escribibles
-- desde el cliente: se crean y actualizan desde el servidor con la service role key.
create policy "Public read products" on products
  for select using (true);

create policy "Public read product_stock" on product_stock
  for select using (true);

-- Datos de prueba: las 5 camisetas reales del catálogo
insert into products (slug, team, category, variant, player_name, player_number, price, image) values
  ('argentina-entrenamiento', 'Argentina', 'selecciones', 'Camiseta de entrenamiento', null, null, 1990, '/products/argentina-entrenamiento.png'),
  ('argentina-messi-10', 'Argentina', 'selecciones', 'Camiseta titular', 'Messi', 10, 2490, '/products/argentina-messi-10.png'),
  ('inglaterra-bellingham-10', 'Inglaterra', 'selecciones', 'Camiseta titular', 'Bellingham', 10, 2290, '/products/inglaterra-bellingham-10.png'),
  ('escocia-titular', 'Escocia', 'selecciones', 'Camiseta titular', null, null, 1790, '/products/escocia-titular.png'),
  ('noruega-haaland-9', 'Noruega', 'selecciones', 'Camiseta titular', 'Haaland', 9, 2290, '/products/noruega-haaland-9.png')
on conflict (slug) do nothing;

insert into product_stock (product_id, size, stock)
select p.id, s.size, 6
from products p
cross join lateral (
  select unnest(case p.slug
    when 'argentina-entrenamiento' then array['L', 'XL']
    when 'argentina-messi-10' then array['L', 'XL', 'XXL']
    when 'inglaterra-bellingham-10' then array['XL']
    when 'escocia-titular' then array['L']
    when 'noruega-haaland-9' then array['XL']
  end) as size
) s
on conflict (product_id, size) do nothing;
