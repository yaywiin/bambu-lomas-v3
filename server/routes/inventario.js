const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/inventario
// Agrega existencias en tiempo real desde compras_desglose.
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ROW_NUMBER() OVER (ORDER BY cd.producto) AS id,
        cd.producto,
        cd.tipo_producto                         AS tipo,
        cd.unidad_medida                         AS u_m,
        SUM(cd.cantidad)                         AS existencia,
        (
          SELECT cd2.precio_unitario
          FROM compras_desglose cd2
          JOIN compras c2 ON cd2.compra_id = c2.id
          WHERE cd2.producto      = cd.producto
            AND cd2.tipo_producto  = cd.tipo_producto
            AND c2.deleted_at IS NULL
          ORDER BY c2.fecha_compra DESC, cd2.id DESC
          LIMIT 1
        )                                        AS costo_promedio,
        MAX(c.fecha_compra)                      AS ultima_compra
      FROM compras_desglose cd
      JOIN compras c ON cd.compra_id = c.id
      WHERE c.deleted_at IS NULL
      GROUP BY cd.producto, cd.tipo_producto, cd.unidad_medida
      ORDER BY cd.producto ASC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener inventario:', err)
    res.status(500).json({ success: false, message: 'Error al obtener inventario' })
  }
})

module.exports = router
