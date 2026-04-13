require('dotenv').config()
const { Pool } = require('pg')

// Neon recomienda usar connection string para ambientes serverless
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 10000,
})

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de BD:', err.message)
})

module.exports = pool
