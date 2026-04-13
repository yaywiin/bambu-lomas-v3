const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/gastos — Listar gastos activos
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, concepto, fecha_pago, monto, pagado_a, forma_pago, created_at, edited_at
       FROM gastos
       WHERE deleted_at IS NULL
       ORDER BY id DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener gastos:', err)
    res.status(500).json({ success: false, message: 'Error al obtener gastos' })
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/gastos/:id
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT id, concepto, fecha_pago, monto, pagado_a, forma_pago, created_at, edited_at
       FROM gastos WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Gasto no encontrado' })
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al obtener gasto:', err)
    res.status(500).json({ success: false, message: 'Error al obtener gasto' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/gastos — Crear gasto (id auto-generado por BD)
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { concepto, fechaPago, monto, pagadoA, formaPago } = req.body

  if (!concepto || !fechaPago || monto === undefined || !pagadoA || !formaPago) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO gastos (concepto, fecha_pago, monto, pagado_a, forma_pago)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, concepto, fecha_pago, monto, pagado_a, forma_pago, created_at`,
      [concepto, fechaPago, monto, pagadoA, formaPago]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al crear gasto:', err)
    res.status(500).json({ success: false, message: 'Error al crear gasto' })
  }
})

// ──────────────────────────────────────────────────────────────
// PUT /api/gastos/:id — Actualizar gasto
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { concepto, fechaPago, monto, pagadoA, formaPago } = req.body

  if (!concepto || !fechaPago || monto === undefined || !pagadoA || !formaPago) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' })
  }

  try {
    const result = await pool.query(
      `UPDATE gastos
       SET concepto=$1, fecha_pago=$2, monto=$3, pagado_a=$4, forma_pago=$5, edited_at=NOW()
       WHERE id=$6 AND deleted_at IS NULL
       RETURNING id, concepto, fecha_pago, monto, pagado_a, forma_pago, created_at, edited_at`,
      [concepto, fechaPago, monto, pagadoA, formaPago, id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Gasto no encontrado' })
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al actualizar gasto:', err)
    res.status(500).json({ success: false, message: 'Error al actualizar gasto' })
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/gastos/:id — Soft delete
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `UPDATE gastos SET deleted_at=NOW()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING id, concepto`,
      [id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Gasto no encontrado' })
    res.json({
      success: true,
      message: `Gasto #${result.rows[0].id} eliminado`,
      data: result.rows[0]
    })
  } catch (err) {
    console.error('Error al eliminar gasto:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar gasto' })
  }
})

module.exports = router
