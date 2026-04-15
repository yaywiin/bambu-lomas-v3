const express = require('express')
const router = express.Router({ mergeParams: true })
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/compras/:compraId/desglose — Listar renglones de una compra
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { compraId } = req.params
  try {
    const result = await pool.query(
      `SELECT id, compra_id, producto, tipo_producto, unidad_medida,
              cantidad, precio_unitario, descuento, total
       FROM compras_desglose
       WHERE compra_id = $1
       ORDER BY id ASC`,
      [compraId]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener desglose:', err)
    res.status(500).json({ success: false, message: 'Error al obtener desglose' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/compras/:compraId/desglose — Crear nuevo renglón
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { compraId } = req.params
  const { producto, tipo_producto, unidad_medida, cantidad, precio_unitario, descuento, total } = req.body

  if (!producto || !tipo_producto || !unidad_medida || cantidad === undefined || precio_unitario === undefined || total === undefined) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' })
  }

  try {
    const compraExiste = await pool.query(
      'SELECT id FROM compras WHERE id = $1 AND deleted_at IS NULL',
      [compraId]
    )
    if (compraExiste.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Compra no encontrada' })
    }

    const result = await pool.query(
      `INSERT INTO compras_desglose
         (compra_id, producto, tipo_producto, unidad_medida, cantidad, precio_unitario, descuento, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, compra_id, producto, tipo_producto, unidad_medida, cantidad, precio_unitario, descuento, total`,
      [compraId, producto, tipo_producto, unidad_medida, cantidad, precio_unitario, descuento || 0, total]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al crear renglón:', err)
    res.status(500).json({ success: false, message: 'Error al crear renglón' })
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/compras/:compraId/desglose/:id — Eliminar renglón
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { compraId, id } = req.params
  try {
    const result = await pool.query(
      `DELETE FROM compras_desglose
       WHERE id = $1 AND compra_id = $2
       RETURNING id`,
      [id, compraId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Renglón no encontrado' })
    }
    res.json({ success: true, message: `Renglón #${id} eliminado` })
  } catch (err) {
    console.error('Error al eliminar renglón:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar renglón' })
  }
})

module.exports = router
