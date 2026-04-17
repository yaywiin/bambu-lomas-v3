-- ============================================================
-- Migración: Ventas y detalle de ventas
-- Bambu Lomas — Ejecutar en Neon SQL Editor o con psql
-- ============================================================

-- Tabla principal de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id           SERIAL PRIMARY KEY,
  folio        VARCHAR(20)   NOT NULL UNIQUE,                     -- ORD-XXXX
  cliente      VARCHAR(150)  NOT NULL DEFAULT 'Cliente General',
  cajero       VARCHAR(100)  NOT NULL,
  forma_pago   VARCHAR(50)   NOT NULL DEFAULT 'Efectivo',
  total        NUMERIC(10,2) NOT NULL DEFAULT 0,
  mesa         INTEGER       NULL,                                 -- NULL si no es orden de mesa
  hora_pedido  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  hora_cierre  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Detalle de items por venta
CREATE TABLE IF NOT EXISTS ventas_items (
  id          SERIAL PRIMARY KEY,
  venta_id    INTEGER       NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  descripcion TEXT          NOT NULL,
  cantidad    INTEGER       NOT NULL DEFAULT 1,
  precio      NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ventas_folio ON ventas(folio);
CREATE INDEX IF NOT EXISTS idx_ventas_cajero ON ventas(cajero);
CREATE INDEX IF NOT EXISTS idx_ventas_hora ON ventas(hora_pedido DESC);
CREATE INDEX IF NOT EXISTS idx_ventas_items_venta ON ventas_items(venta_id);
