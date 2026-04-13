const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcryptjs')

// ──────────────────────────────────────────────────────────────
// GET /api/usuarios — Listar usuarios activos (sin deleted_at)
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, correo, usuario, rol, created_at, edited_at
       FROM usuarios
       WHERE deleted_at IS NULL
       ORDER BY id ASC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' })
  }
})

// ──────────────────────────────────────────────────────────────
// GET /api/usuarios/:id — Obtener un usuario por id
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT id, nombre, correo, usuario, rol, created_at, edited_at
       FROM usuarios
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al obtener usuario:', err)
    res.status(500).json({ success: false, message: 'Error al obtener usuario' })
  }
})

// ──────────────────────────────────────────────────────────────
// POST /api/usuarios — Crear nuevo usuario
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { nombre, correo, usuario, rol, contraseña } = req.body

  if (!nombre || !correo || !usuario || !rol || !contraseña) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' })
  }

  try {
    // Verificar duplicados
    const existe = await pool.query(
      `SELECT id FROM usuarios WHERE (correo = $1 OR usuario = $2) AND deleted_at IS NULL`,
      [correo, usuario]
    )
    if (existe.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'El correo o usuario ya está en uso' })
    }

    const hash = await bcrypt.hash(contraseña, 10)

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, usuario, rol, contraseña)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, correo, usuario, rol, created_at, edited_at`,
      [nombre, correo, usuario, rol, hash]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al crear usuario:', err)
    res.status(500).json({ success: false, message: 'Error al crear usuario' })
  }
})

// ──────────────────────────────────────────────────────────────
// PUT /api/usuarios/:id — Actualizar usuario
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, correo, usuario, rol, contraseña } = req.body

  if (!nombre || !correo || !usuario || !rol) {
    return res.status(400).json({ success: false, message: 'Nombre, correo, usuario y rol son requeridos' })
  }

  try {
    let query, params

    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10)
      query = `UPDATE usuarios
               SET nombre=$1, correo=$2, usuario=$3, rol=$4, contraseña=$5, edited_at=NOW()
               WHERE id=$6 AND deleted_at IS NULL
               RETURNING id, nombre, correo, usuario, rol, created_at, edited_at`
      params = [nombre, correo, usuario, rol, hash, id]
    } else {
      query = `UPDATE usuarios
               SET nombre=$1, correo=$2, usuario=$3, rol=$4, edited_at=NOW()
               WHERE id=$5 AND deleted_at IS NULL
               RETURNING id, nombre, correo, usuario, rol, created_at, edited_at`
      params = [nombre, correo, usuario, rol, id]
    }

    const result = await pool.query(query, params)
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' })
  }
})

// ──────────────────────────────────────────────────────────────
// DELETE /api/usuarios/:id — Soft delete (marca deleted_at)
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `UPDATE usuarios SET deleted_at=NOW()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING id, nombre`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }
    res.json({
      success: true,
      message: `Usuario "${result.rows[0].nombre}" eliminado`,
      data: result.rows[0]
    })
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' })
  }
})

module.exports = router
