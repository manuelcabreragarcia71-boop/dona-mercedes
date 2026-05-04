# 🟢 Configuración de Supabase - DOÑA MERCEDES

Esta guía permite usar Supabase como backend principal de la app.

## 1. Crear proyecto

1. Entra en https://supabase.com/
2. Crea un proyecto nuevo.
3. Ve a `Project Settings` → `API`.
4. Copia:
   - `Project URL`
   - `anon public key`
5. Edita `supabase.config.js`:

```javascript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY';
```

## 2. Backend seleccionado

La app ya está configurada para usar Supabase:

```javascript
export const BACKEND_PROVIDER = 'supabase';
```

Está en `src/utils/constants.js`.

Si quieres volver a Supabase, cambia el valor a:

```javascript
export const BACKEND_PROVIDER = 'firebase';
```

## 3. Crear tablas SQL

Ve a Supabase → `SQL Editor` → `New query` y ejecuta:

```sql
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null default 0,
  description text default '',
  available boolean not null default true,
  image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  delivery_option text not null check (delivery_option in ('pickup', 'delivery')),
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
before update on orders
for each row execute function set_updated_at();

drop trigger if exists settings_set_updated_at on settings;
create trigger settings_set_updated_at
before update on settings
for each row execute function set_updated_at();
```

## 4. Activar realtime

Ejecuta en SQL Editor:

```sql
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table settings;
```

Si Supabase indica que una tabla ya está añadida, puedes ignorar ese aviso.

## 5. Crear bucket de imágenes

1. Ve a `Storage`.
2. Crea un bucket llamado:

```text
product-images
```

3. Márcalo como `Public bucket`.

## 6. Políticas RLS (IMPORTANTE: anon + authenticated)

Las políticas DEBEN incluir ambos roles: `anon` y `authenticated`.
Si solo pones `anon`, los usuarios logueados NO podrán ver productos ni hacer pedidos.

```sql
alter table products enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

-- PRODUCTS
create policy "products_select" on products for select to anon, authenticated using (true);
create policy "products_insert" on products for insert to anon, authenticated with check (true);
create policy "products_update" on products for update to anon, authenticated using (true) with check (true);
create policy "products_delete" on products for delete to anon, authenticated using (true);

-- ORDERS
create policy "orders_select" on orders for select to anon, authenticated using (true);
create policy "orders_insert" on orders for insert to anon, authenticated with check (true);
create policy "orders_update" on orders for update to anon, authenticated using (true) with check (true);

-- SETTINGS
create policy "settings_select" on settings for select to anon, authenticated using (true);
create policy "settings_all" on settings for all to anon, authenticated using (true) with check (true);
```

## 6b. Políticas de Storage (OBLIGATORIO para subir imágenes)

Sin estas políticas, la subida de imágenes SIEMPRE falla:

```sql
create policy "storage_read" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "storage_insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'product-images');
create policy "storage_update" on storage.objects for update to anon, authenticated using (bucket_id = 'product-images');
create policy "storage_delete" on storage.objects for delete to anon, authenticated using (bucket_id = 'product-images');
```

> **Si ya tienes la app funcionando y quieres arreglar estos problemas, ejecuta el archivo `FIX_DATABASE.sql` en el SQL Editor de Supabase.**

## 7. Insertar productos de prueba

```sql
insert into products (name, price, description, available) values
('Tomate', 2.50, 'Tomate fresco de la huerta', true),
('Manzana Golden', 1.90, 'Manzanas Golden dulces y crujientes', true),
('Plátano de Canarias', 1.50, 'Plátanos maduros de Canarias', true),
('Naranja', 2.00, 'Naranjas valencianas para zumo', true),
('Lechuga', 1.20, 'Lechuga fresca y crujiente', true);
```

## 8. Ejecutar la app

```bash
npm start
```

La app usará Supabase porque `BACKEND_PROVIDER` está configurado como `supabase`.

## Nota de seguridad

La app actual mantiene el login admin local. Para una versión de producción avanzada, lo ideal es migrar el panel admin a `Supabase Auth` con usuarios reales y políticas RLS restringidas.
