require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // Neon requiere SSL
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL (Neon)')
})

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de BD:', err)
})

module.exports = pool
