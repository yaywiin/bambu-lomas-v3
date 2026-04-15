const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/recetas
// Devuelve todas las recetas con su costo total calculado.
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.nombre,
        r.created_at,
        COALESCE(SUM(ri.costo_calculado), 0) AS costo
      FROM recetas r
      LEFT JOIN recetas_ingredientes ri ON ri.receta_id = r.id
      WHERE r.deleted_at IS NULL
      GROUP BY r.id, r.nombre, r.created_at
      ORDER BY r.created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener recetas:', err)
    res.status(500).json({ success: false, message: 'Error al obtener recetas' })
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/recetas/:id
// Devuelve una receta con todos sus ingredientes.
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const recetaResult = await pool.query(
      `SELECT id, nombre, created_at FROM recetas WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (recetaResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' })
    }

    const ingredientesResult = await pool.query(
      `SELECT id, producto, unidad, cantidad, costo_calculado
       FROM recetas_ingredientes
       WHERE receta_id = $1
       ORDER BY id ASC`,
      [id]
    )

    res.json({
      success: true,
      data: {
        ...recetaResult.rows[0],
        ingredientes: ingredientesResult.rows
      }
    })
  } catch (err) {
    console.error('Error al obtener receta:', err)
    res.status(500).json({ success: false, message: 'Error al obtener receta' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/recetas
// Crea una receta nueva con sus ingredientes (transacción).
// Body: { nombre: string, ingredientes: [{producto, unidad, cantidad, costo_calculado}] }
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { nombre, ingredientes = [] } = req.body

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' })
  }
  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return res.status(400).json({ success: false, message: 'Debe incluir al menos un ingrediente' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const recetaResult = await client.query(
      `INSERT INTO recetas (nombre) VALUES ($1) RETURNING id, nombre, created_at`,
      [nombre.trim()]
    )
    const receta = recetaResult.rows[0]

    for (const ing of ingredientes) {
      await client.query(
        `INSERT INTO recetas_ingredientes (receta_id, producto, unidad, cantidad, costo_calculado)
         VALUES ($1, $2, $3, $4, $5)`,
        [receta.id, ing.producto, ing.unidad, ing.cantidad, ing.costo_calculado]
      )
    }

    await client.query('COMMIT')

    const costoTotal = ingredientes.reduce((sum, i) => sum + Number(i.costo_calculado), 0)
    res.status(201).json({
      success: true,
      data: { ...receta, costo: costoTotal, ingredientes }
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error al crear receta:', err)
    res.status(500).json({ success: false, message: 'Error al crear receta' })
  } finally {
    client.release()
  }
})

// ──────────────────────────────────────────────────────────────
// PUT /api/recetas/:id
// Actualiza los ingredientes de una receta existente.
// El nombre no se puede cambiar (como el front lo define).
// Body: { ingredientes: [{producto, unidad, cantidad, costo_calculado}] }
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { ingredientes = [] } = req.body

  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return res.status(400).json({ success: false, message: 'Debe incluir al menos un ingrediente' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Verificar que existe
    const check = await client.query(
      `SELECT id FROM recetas WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (check.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ success: false, message: 'Receta no encontrada' })
    }

    // Borrar ingredientes viejos y reinsertar
    await client.query(`DELETE FROM recetas_ingredientes WHERE receta_id = $1`, [id])
    for (const ing of ingredientes) {
      await client.query(
        `INSERT INTO recetas_ingredientes (receta_id, producto, unidad, cantidad, costo_calculado)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, ing.producto, ing.unidad, ing.cantidad, ing.costo_calculado]
      )
    }

    await client.query(`UPDATE recetas SET updated_at = NOW() WHERE id = $1`, [id])
    await client.query('COMMIT')

    res.json({ success: true, message: 'Receta actualizada correctamente' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error al actualizar receta:', err)
    res.status(500).json({ success: false, message: 'Error al actualizar receta' })
  } finally {
    client.release()
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/recetas/:id
// Soft-delete de la receta.
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `UPDATE recetas SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' })
    }
    res.json({ success: true, message: 'Receta eliminada correctamente' })
  } catch (err) {
    console.error('Error al eliminar receta:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar receta' })
  }
})

module.exports = router
