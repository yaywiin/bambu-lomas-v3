const express = require('express')
const router = express.Router()
const pool = require('../db')

// ──────────────────────────────────────────────────────────────
// GET /api/carta
// Devuelve todos los ítems de la carta (no eliminados).
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.nombre,
        c.receta_id,
        r.nombre AS receta_nombre,
        c.categoria,
        c.descripcion,
        c.stock,
        c.precio,
        c.foto_principal,
        c.galeria,
        c.tiene_variaciones,
        c.grupos_variacion,
        c.disponible,
        c.created_at
      FROM carta c
      LEFT JOIN recetas r ON r.id = c.receta_id AND r.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      ORDER BY c.created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener carta:', err)
    res.status(500).json({ success: false, message: 'Error al obtener la carta' })
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/carta/:id
// Devuelve un ítem específico.
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(`
      SELECT
        c.id, c.nombre, c.receta_id, r.nombre AS receta_nombre,
        c.categoria, c.descripcion, c.stock, c.precio,
        c.foto_principal, c.galeria, c.tiene_variaciones,
        c.grupos_variacion, c.disponible, c.created_at
      FROM carta c
      LEFT JOIN recetas r ON r.id = c.receta_id AND r.deleted_at IS NULL
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ítem no encontrado' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al obtener ítem:', err)
    res.status(500).json({ success: false, message: 'Error al obtener el ítem' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/carta
// Crea un nuevo ítem en la carta.
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    nombre, receta_id, categoria, descripcion,
    stock, precio, foto_principal, galeria,
    tiene_variaciones, grupos_variacion, disponible
  } = req.body

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' })
  }
  if (!categoria) {
    return res.status(400).json({ success: false, message: 'La categoría es requerida' })
  }
  if (!precio || Number(precio) <= 0) {
    return res.status(400).json({ success: false, message: 'El precio debe ser mayor a 0' })
  }

  try {
    const result = await pool.query(`
      INSERT INTO carta
        (nombre, receta_id, categoria, descripcion, stock, precio,
         foto_principal, galeria, tiene_variaciones, grupos_variacion, disponible)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [
      nombre.trim(),
      receta_id || null,
      categoria,
      descripcion || '',
      stock ?? null,
      Number(precio),
      foto_principal || '',
      JSON.stringify(galeria || []),
      tiene_variaciones ?? false,
      JSON.stringify(grupos_variacion || []),
      disponible ?? true
    ])

    // Obtener con JOIN para devolver receta_nombre
    const item = await pool.query(`
      SELECT c.*, r.nombre AS receta_nombre
      FROM carta c
      LEFT JOIN recetas r ON r.id = c.receta_id AND r.deleted_at IS NULL
      WHERE c.id = $1
    `, [result.rows[0].id])

    res.status(201).json({ success: true, data: item.rows[0] })
  } catch (err) {
    console.error('Error al crear ítem de carta:', err)
    res.status(500).json({ success: false, message: 'Error al crear el ítem' })
  }
})

// ──────────────────────────────────────────────────────────────
// PUT /api/carta/:id
// Actualiza un ítem de la carta.
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const {
    nombre, receta_id, categoria, descripcion,
    stock, precio, foto_principal, galeria,
    tiene_variaciones, grupos_variacion, disponible
  } = req.body

  try {
    const check = await pool.query(
      'SELECT id FROM carta WHERE id = $1 AND deleted_at IS NULL', [id]
    )
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ítem no encontrado' })
    }

    await pool.query(`
      UPDATE carta SET
        nombre = $1, receta_id = $2, categoria = $3, descripcion = $4,
        stock = $5, precio = $6, foto_principal = $7, galeria = $8,
        tiene_variaciones = $9, grupos_variacion = $10, disponible = $11,
        updated_at = NOW()
      WHERE id = $12
    `, [
      nombre.trim(),
      receta_id || null,
      categoria,
      descripcion || '',
      stock ?? null,
      Number(precio),
      foto_principal || '',
      JSON.stringify(galeria || []),
      tiene_variaciones ?? false,
      JSON.stringify(grupos_variacion || []),
      disponible ?? true,
      id
    ])

    const item = await pool.query(`
      SELECT c.*, r.nombre AS receta_nombre
      FROM carta c
      LEFT JOIN recetas r ON r.id = c.receta_id AND r.deleted_at IS NULL
      WHERE c.id = $1
    `, [id])

    res.json({ success: true, data: item.rows[0] })
  } catch (err) {
    console.error('Error al actualizar ítem:', err)
    res.status(500).json({ success: false, message: 'Error al actualizar el ítem' })
  }
})

// ──────────────────────────────────────────────────────────────
// PATCH /api/carta/:id/disponible
// Cambia solo el flag disponible (toggle rápido).
// ──────────────────────────────────────────────────────────────
router.patch('/:id/disponible', async (req, res) => {
  const { id } = req.params
  const { disponible } = req.body

  if (typeof disponible !== 'boolean') {
    return res.status(400).json({ success: false, message: '"disponible" debe ser boolean' })
  }

  try {
    const result = await pool.query(
      'UPDATE carta SET disponible = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING id, disponible',
      [disponible, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ítem no encontrado' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al cambiar disponibilidad:', err)
    res.status(500).json({ success: false, message: 'Error al cambiar disponibilidad' })
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/carta/:id
// Soft-delete de un ítem.
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'UPDATE carta SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ítem no encontrado' })
    }
    res.json({ success: true, message: 'Ítem eliminado correctamente' })
  } catch (err) {
    console.error('Error al eliminar ítem:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar el ítem' })
  }
})

module.exports = router
