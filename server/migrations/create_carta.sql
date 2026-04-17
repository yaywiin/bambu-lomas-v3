-- ============================================================
-- Migración: Tabla carta
-- Ejecutar en Neon SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS carta (
  id                SERIAL PRIMARY KEY,
  nombre            VARCHAR(200)  NOT NULL,
  receta_id         INTEGER       REFERENCES recetas(id) ON DELETE SET NULL,
  categoria         VARCHAR(100)  NOT NULL,
  descripcion       TEXT          DEFAULT '',
  stock             INTEGER,
  precio            NUMERIC(10,2) NOT NULL DEFAULT 0,
  foto_principal    TEXT          DEFAULT '',
  galeria           JSONB         NOT NULL DEFAULT '[]',
  tiene_variaciones BOOLEAN       NOT NULL DEFAULT false,
  grupos_variacion  JSONB         NOT NULL DEFAULT '[]',
  disponible        BOOLEAN       NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- Trigger para updated_at
CREATE TRIGGER carta_updated_at
  BEFORE UPDATE ON carta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_carta_categoria   ON carta(categoria)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_carta_disponible  ON carta(disponible) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_carta_receta_id   ON carta(receta_id)  WHERE deleted_at IS NULL;
