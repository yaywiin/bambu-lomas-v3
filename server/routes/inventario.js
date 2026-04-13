const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/inventario — Listar inventario completo
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, producto, tipo, existencia, u_m, costo_promedio, ultima_compra
       FROM inventario
       ORDER BY producto ASC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener inventario:', err)
    res.status(500).json({ success: false, message: 'Error al obtener inventario' })
  }
})

module.exports = router
