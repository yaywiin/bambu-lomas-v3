const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/ventas — Listar todas las ventas (con items incluidos)
// Soporta filtro por cajero: GET /api/ventas?cajero=jp
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { cajero } = req.query
  try {
    let query = `
      SELECT
        v.id, v.folio, v.cliente, v.cajero, v.forma_pago, v.total,
        v.mesa, v.hora_pedido, v.hora_cierre,
        json_agg(
          json_build_object(
            'id',          vi.id,
            'descripcion', vi.descripcion,
            'cantidad',    vi.cantidad,
            'precio',      vi.precio
          ) ORDER BY vi.id
        ) FILTER (WHERE vi.id IS NOT NULL) AS items
      FROM ventas v
      LEFT JOIN ventas_items vi ON vi.venta_id = v.id
    `
    const params = []
    if (cajero) {
      query += ` WHERE v.cajero = $1`
      params.push(cajero)
    }
    query += ` GROUP BY v.id ORDER BY v.hora_pedido DESC`

    const result = await pool.query(query, params)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener ventas:', err)
    res.status(500).json({ success: false, message: 'Error al obtener ventas' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/ventas — Registrar una nueva venta
// Body: { folio, cliente, cajero, forma_pago, total, mesa?, items[] }
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { folio, cliente, cajero, forma_pago, total, mesa, items } = req.body

  if (!folio || !cajero || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'folio, cajero e items son requeridos' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const ventaResult = await client.query(
      `INSERT INTO ventas (folio, cliente, cajero, forma_pago, total, mesa)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        folio,
        cliente || 'Cliente General',
        cajero,
        forma_pago || 'Efectivo',
        total ?? 0,
        mesa || null
      ]
    )
    const venta = ventaResult.rows[0]

    for (const item of items) {
      await client.query(
        `INSERT INTO ventas_items (venta_id, descripcion, cantidad, precio)
         VALUES ($1, $2, $3, $4)`,
        [venta.id, item.descripcion, item.cantidad, item.precio]
      )
    }

    await client.query('COMMIT')

    res.status(201).json({ success: true, data: venta })
  } catch (err) {
    await client.query('ROLLBACK')
    // Folio duplicado
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'El folio ya existe' })
    }
    console.error('Error al registrar venta:', err)
    res.status(500).json({ success: false, message: 'Error al registrar venta' })
  } finally {
    client.release()
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/ventas/:id — Obtener una venta por ID con sus items
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT
        v.id, v.folio, v.cliente, v.cajero, v.forma_pago, v.total,
        v.mesa, v.hora_pedido, v.hora_cierre,
        json_agg(
          json_build_object(
            'id',          vi.id,
            'descripcion', vi.descripcion,
            'cantidad',    vi.cantidad,
            'precio',      vi.precio
          ) ORDER BY vi.id
        ) FILTER (WHERE vi.id IS NOT NULL) AS items
       FROM ventas v
       LEFT JOIN ventas_items vi ON vi.venta_id = v.id
       WHERE v.id = $1
       GROUP BY v.id`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Venta no encontrada' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al obtener venta:', err)
    res.status(500).json({ success: false, message: 'Error al obtener venta' })
  }
})

module.exports = router
