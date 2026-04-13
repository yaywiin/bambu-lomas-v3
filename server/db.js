require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.PGHOST,
  database: process.env.PGDATABASE,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port:     5432,
  ssl: { rejectUnauthorized: false },
  max: 1,                        // Serverless: máximo 1 conexión por función
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 10000, // 10s para cold starts en Vercel/Neon
})

pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL (Neon)')
})

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de BD:', err)
})

module.exports = pool
