require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const PORT = process.env.PORT || 3000

// ──────────────────────────────────────────────────────────────
// Middlewares
// ──────────────────────────────────────────────────────────────

// ALLOWED_ORIGINS: lista separada por comas en la variable de entorno
// Ej: https://mi-admin.vercel.app,https://otro-dominio.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: Origin '${origin}' no permitido`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging básico de requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// ──────────────────────────────────────────────────────────────
// Rutas
// ──────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'))
app.use('/api/usuarios',   require('./routes/usuarios'))
app.use('/api/ventas',     require('./routes/ventas'))
app.use('/api/compras',    require('./routes/compras'))
app.use('/api/compras/:compraId/desglose', require('./routes/compras_desglose'))
app.use('/api/gastos',     require('./routes/gastos'))
app.use('/api/inventario', require('./routes/inventario'))
app.use('/api/recetas',    require('./routes/recetas'))
app.use('/api/carta',      require('./routes/carta'))
app.use('/api/upload',     require('./routes/upload'))

// Ruta raíz: health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ success: true, message: 'API funcionando y BD conectada ✅', timestamp: new Date() })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error de conexión a BD ❌', error: err.message })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta ${req.method} ${req.url} no encontrada` })
})

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err)
  res.status(500).json({ success: false, message: 'Error interno del servidor' })
})

// ──────────────────────────────────────────────────────────────
// Iniciar servidor (solo en local, no en Vercel)
// ──────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
    console.log(`👥 Usuarios API: http://localhost:${PORT}/api/usuarios\n`)
  })
}

// Exportar para Vercel serverless
module.exports = app
