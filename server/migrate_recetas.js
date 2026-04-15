require('dotenv').config()
const pool = require('./db')

async function crearTablaRecetas() {
  const client = await pool.connect()
  console.log('\n🔧 Creando tablas: recetas y recetas_ingredientes...\n')

  try {
    await client.query('BEGIN')

    // Tabla principal de recetas
    await client.query(`
      CREATE TABLE IF NOT EXISTS recetas (
        id          SERIAL PRIMARY KEY,
        nombre      VARCHAR(255) NOT NULL,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        deleted_at  TIMESTAMPTZ
      )
    `)
    console.log('  ✅ Tabla recetas creada (o ya existía)')

    // Tabla de ingredientes por receta
    await client.query(`
      CREATE TABLE IF NOT EXISTS recetas_ingredientes (
        id               SERIAL PRIMARY KEY,
        receta_id        INTEGER      NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
        producto         VARCHAR(255) NOT NULL,
        unidad           VARCHAR(100) NOT NULL,
        cantidad         NUMERIC(12, 4) NOT NULL DEFAULT 0,
        costo_calculado  NUMERIC(12, 2) NOT NULL DEFAULT 0,
        created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `)
    console.log('  ✅ Tabla recetas_ingredientes creada (o ya existía)')

    await client.query('COMMIT')
    console.log('\n🎉 Tablas listas para usar.\n')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Error, rollback aplicado:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

crearTablaRecetas()
