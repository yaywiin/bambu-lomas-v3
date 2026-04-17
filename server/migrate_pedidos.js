require('dotenv').config()
const pool = require('./db')

const createPedidosTable = async () => {
  const client = await pool.connect()
  try {
    console.log('🔄 Creando tabla pedidos...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id           SERIAL PRIMARY KEY,
        folio        VARCHAR(20) NOT NULL UNIQUE,
        cliente      VARCHAR(255) NOT NULL DEFAULT 'Cliente General',
        estado       VARCHAR(50) NOT NULL DEFAULT 'recibido'
                     CHECK (estado IN ('recibido', 'preparacion', 'listo', 'entregado', 'cancelado')),
        origen       VARCHAR(100) NOT NULL DEFAULT 'App Cliente',
        items        JSONB NOT NULL DEFAULT '[]',
        fecha_pedido TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        fecha_update TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Índices para mejorar el rendimiento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
      CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido DESC);
      CREATE INDEX IF NOT EXISTS idx_pedidos_folio ON pedidos(folio);
    `)

    // Función para auto-actualizar fecha_update
    await client.query(`
      CREATE OR REPLACE FUNCTION update_pedidos_fecha_update()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.fecha_update = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

    await client.query(`
      DROP TRIGGER IF EXISTS trg_pedidos_update ON pedidos;
      CREATE TRIGGER trg_pedidos_update
        BEFORE UPDATE ON pedidos
        FOR EACH ROW EXECUTE FUNCTION update_pedidos_fecha_update();
    `)

    console.log('✅ Tabla pedidos creada exitosamente.')
    console.log('✅ Índices creados.')
    console.log('✅ Trigger de fecha_update creado.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error creando la tabla:', err.message)
    process.exit(1)
  } finally {
    client.release()
  }
}

createPedidosTable()
