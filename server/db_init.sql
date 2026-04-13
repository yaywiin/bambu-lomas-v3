-- ============================================================
-- Script de inicialización de base de datos - Bambu Lomas
-- Ejecutar en Neon SQL Editor o con psql
-- ============================================================

-- Tabla de usuarios del sistema de administración
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(150)  NOT NULL,
  correo        VARCHAR(255)  NOT NULL UNIQUE,
  usuario       VARCHAR(100)  NOT NULL UNIQUE,
  rol           VARCHAR(50)   NOT NULL CHECK (rol IN ('Administrador', 'Cajero', 'Mesero')),
  password_hash TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Datos iniciales de ejemplo (contraseña: admin123)
INSERT INTO usuarios (nombre, correo, usuario, rol, password_hash)
VALUES (
  'Admin Principal',
  'admin@bambulomas.com',
  'admin',
  'Administrador',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- password
) ON CONFLICT (correo) DO NOTHING;
