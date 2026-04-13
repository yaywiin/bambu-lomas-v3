const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/compras — Listar compras activas
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, proveedor, "forma-pago", fecha_compra, total, created_at, edited_at
       FROM compras
       WHERE deleted_at IS NULL
       ORDER BY id DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener compras:', err)
    res.status(500).json({ success: false, message: 'Error al obtener compras' })
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/compras/:id — Obtener una compra por id (ticket)
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT id, proveedor, "forma-pago", fecha_compra, total, created_at, edited_at
       FROM compras
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Compra no encontrada' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al obtener compra:', err)
    res.status(500).json({ success: false, message: 'Error al obtener compra' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/compras — Crear nueva compra
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { id, proveedor, formaPago, fechaCompra, total } = req.body

  if (!id || !proveedor || !formaPago || !fechaCompra || total === undefined) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos (incluyendo el ticket/id)' })
  }

  try {
    // Verificar que el id no exista ya
    const existe = await pool.query(
      'SELECT id FROM compras WHERE id = $1 AND deleted_at IS NULL',
      [id]
    )
    if (existe.rows.length > 0) {
      return res.status(409).json({ success: false, message: `El ticket #${id} ya existe` })
    }

    const result = await pool.query(
      `INSERT INTO compras (id, proveedor, "forma-pago", fecha_compra, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, proveedor, "forma-pago", fecha_compra, total, created_at`,
      [id, proveedor, formaPago, fechaCompra, total]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al crear compra:', err)
    res.status(500).json({ success: false, message: 'Error al crear compra' })
  }
})

// ──────────────────────────────────────────────────────────────
// PUT /api/compras/:id — Actualizar compra
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { proveedor, formaPago, fechaCompra, total } = req.body

  if (!proveedor || !formaPago || !fechaCompra || total === undefined) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' })
  }

  try {
    const result = await pool.query(
      `UPDATE compras
       SET proveedor=$1, "forma-pago"=$2, fecha_compra=$3, total=$4, edited_at=NOW()
       WHERE id=$5 AND deleted_at IS NULL
       RETURNING id, proveedor, "forma-pago", fecha_compra, total, created_at, edited_at`,
      [proveedor, formaPago, fechaCompra, total, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Compra no encontrada' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al actualizar compra:', err)
    res.status(500).json({ success: false, message: 'Error al actualizar compra' })
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/compras/:id — Soft delete
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `UPDATE compras SET deleted_at=NOW()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING id, proveedor`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Compra no encontrada' })
    }
    res.json({
      success: true,
      message: `Compra #${result.rows[0].id} eliminada`,
      data: result.rows[0]
    })
  } catch (err) {
    console.error('Error al eliminar compra:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar compra' })
  }
})

module.exports = router
