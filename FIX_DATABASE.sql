-- ============================================
-- DOÑA MERCEDES - FIX COMPLETO DE BASE DE DATOS
-- ============================================
-- Ejecuta TODO este script en Supabase → SQL Editor → New Query
-- Esto arregla: productos desaparecen tras login + subida de imágenes falla
-- ============================================

-- =====================
-- 1. BORRAR POLÍTICAS ROTAS (solo tenían permiso para 'anon')
-- =====================

DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public insert products" ON products;
DROP POLICY IF EXISTS "Public update products" ON products;
DROP POLICY IF EXISTS "Public delete products" ON products;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public update orders" ON orders;
DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Public upsert settings" ON settings;

-- =====================
-- 2. CREAR POLÍTICAS CORRECTAS (anon + authenticated)
-- =====================

-- PRODUCTS: todos pueden leer
CREATE POLICY "products_select" ON products
  FOR SELECT TO anon, authenticated
  USING (true);

-- PRODUCTS: todos pueden insertar (admin lo controla desde la app)
CREATE POLICY "products_insert" ON products
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- PRODUCTS: todos pueden actualizar
CREATE POLICY "products_update" ON products
  FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- PRODUCTS: todos pueden borrar
CREATE POLICY "products_delete" ON products
  FOR DELETE TO anon, authenticated
  USING (true);

-- ORDERS: todos pueden crear pedidos
CREATE POLICY "orders_insert" ON orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ORDERS: todos pueden leer pedidos
CREATE POLICY "orders_select" ON orders
  FOR SELECT TO anon, authenticated
  USING (true);

-- ORDERS: todos pueden actualizar pedidos
CREATE POLICY "orders_update" ON orders
  FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- SETTINGS: todos pueden leer
CREATE POLICY "settings_select" ON settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- SETTINGS: todos pueden escribir
CREATE POLICY "settings_all" ON settings
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- =====================
-- 3. STORAGE - Crear bucket si no existe y políticas
-- =====================

-- Insertar bucket (ignorar si ya existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Borrar políticas viejas de storage si existen
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "storage_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;

-- STORAGE: cualquiera puede leer imágenes (son públicas)
CREATE POLICY "storage_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

-- STORAGE: cualquiera puede subir imágenes
CREATE POLICY "storage_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

-- STORAGE: cualquiera puede actualizar imágenes
CREATE POLICY "storage_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'product-images');

-- STORAGE: cualquiera puede borrar imágenes
CREATE POLICY "storage_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'product-images');

-- =====================
-- 4. VERIFICACIÓN
-- =====================
-- Si todo fue bien, verás "Success. No rows returned" en Supabase.
-- Los productos volverán a aparecer tras login y las imágenes se podrán subir.
