require('dotenv').config()
const pool = require('./db')

async function runMigration() {
  const client = await pool.connect()
  console.log('\n🔧 Migración: crear tablas ventas y ventas_items...\n')

  try {
    await client.query('BEGIN')

    console.log('▶ Creando tabla ventas...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id           SERIAL PRIMARY KEY,
        folio        VARCHAR(20)   NOT NULL UNIQUE,
        cliente      VARCHAR(150)  NOT NULL DEFAULT 'Cliente General',
        cajero       VARCHAR(100)  NOT NULL,
        forma_pago   VARCHAR(50)   NOT NULL DEFAULT 'Efectivo',
        total        NUMERIC(10,2) NOT NULL DEFAULT 0,
        mesa         INTEGER       NULL,
        hora_pedido  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        hora_cierre  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `)
    console.log('  ✅ Tabla ventas OK\n')

    console.log('▶ Creando tabla ventas_items...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS ventas_items (
        id          SERIAL PRIMARY KEY,
        venta_id    INTEGER       NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
        descripcion TEXT          NOT NULL,
        cantidad    INTEGER       NOT NULL DEFAULT 1,
        precio      NUMERIC(10,2) NOT NULL DEFAULT 0
      )
    `)
    console.log('  ✅ Tabla ventas_items OK\n')

    console.log('▶ Creando índices...')
    await client.query(`CREATE INDEX IF NOT EXISTS idx_ventas_folio   ON ventas(folio)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_ventas_cajero  ON ventas(cajero)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_ventas_hora    ON ventas(hora_pedido DESC)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_ventas_items   ON ventas_items(venta_id)`)
    console.log('  ✅ Índices OK\n')

    await client.query('COMMIT')
    console.log('🎉 Migración completada exitosamente.\n')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Error, rollback aplicado:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration()
