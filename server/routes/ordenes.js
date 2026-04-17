const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────
// Generador de folio único: WEB-XXXX
// ──────────────────────────────────────────────
const generarFolio = () => {
  const rand = Math.floor(1000 + Math.random() * 9000)
  const ts = Date.now().toString().slice(-4)
  return `WEB-${rand}${ts}`
}

// ──────────────────────────────────────────────
// GET /api/ordenes_remotas
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id::text,
        folio,
        cliente,
        estado,
        origen,
        items,
        (SELECT COALESCE(SUM((item->>'precio')::numeric * (item->>'cantidad')::numeric), 0)
         FROM jsonb_array_elements(items) AS item) AS total,
        fecha_pedido,
        fecha_update
      FROM pedidos
      WHERE estado NOT IN ('entregado', 'cancelado')
      ORDER BY fecha_pedido DESC
      LIMIT 100
    `)

    // Normalizar para que el Kanban siga funcionando sin cambios
    const data = rows.map(r => ({
      id: r.folio,            // El Kanban usa el folio como identificador
      _db_id: r.id,           // ID real de la BD (por si se necesita)
      cliente: r.cliente,
      estado: r.estado,
      origen: r.origen,
      items: r.items,
      total: r.total,
      fecha_pedido: r.fecha_pedido,
      fecha_update: r.fecha_update
    }))

    res.json({ success: true, data })
  } catch (err) {
    console.error('GET /ordenes_remotas error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
})

// ──────────────────────────────────────────────
// POST /api/ordenes_remotas
// ──────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { cliente, items, origen } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items es obligatorio y debe ser un array no vacío.' })
  }

  const folio = generarFolio()

  try {
    const { rows } = await pool.query(`
      INSERT INTO pedidos (folio, cliente, estado, origen, items)
      VALUES ($1, $2, 'recibido', $3, $4)
      RETURNING
        id::text,
        folio,
        cliente,
        estado,
        origen,
        items,
        (SELECT COALESCE(SUM((item->>'precio')::numeric * (item->>'cantidad')::numeric), 0)
         FROM jsonb_array_elements(items) AS item) AS total,
        fecha_pedido
    `, [
      folio,
      cliente?.trim() || 'Cliente General',
      origen || 'App Cliente',
      JSON.stringify(items)
    ])

    const row = rows[0]
    res.status(201).json({
      success: true,
      data: {
        id: row.folio,
        _db_id: row.id,
        cliente: row.cliente,
        estado: row.estado,
        origen: row.origen,
        items: row.items,
        total: row.total,
        fecha_pedido: row.fecha_pedido
      }
    })
  } catch (err) {
    console.error('POST /ordenes_remotas error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
})

// ──────────────────────────────────────────────
// PUT /api/ordenes_remotas/:folio - Actualizar estado
// ──────────────────────────────────────────────
router.put('/:folio', async (req, res) => {
  const { folio } = req.params
  const { estado } = req.body

  const estadosValidos = ['recibido', 'preparacion', 'listo', 'entregado', 'cancelado']
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ success: false, message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}` })
  }

  try {
    const { rows, rowCount } = await pool.query(`
      UPDATE pedidos
      SET estado = $1
      WHERE folio = $2
      RETURNING
        id::text, folio, cliente, estado, origen, items,
        (SELECT COALESCE(SUM((item->>'precio')::numeric * (item->>'cantidad')::numeric), 0)
         FROM jsonb_array_elements(items) AS item) AS total,
        fecha_pedido, fecha_update
    `, [estado, folio])

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' })
    }

    const row = rows[0]
    res.json({
      success: true,
      data: {
        id: row.folio,
        _db_id: row.id,
        cliente: row.cliente,
        estado: row.estado,
        origen: row.origen,
        items: row.items,
        total: row.total,
        fecha_pedido: row.fecha_pedido,
        fecha_update: row.fecha_update
      }
    })
  } catch (err) {
    console.error('PUT /ordenes_remotas error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
})

// ──────────────────────────────────────────────
// DELETE /api/ordenes_remotas/:folio
// ──────────────────────────────────────────────
router.delete('/:folio', async (req, res) => {
  const { folio } = req.params
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM pedidos WHERE folio = $1',
      [folio]
    )

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /ordenes_remotas error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
