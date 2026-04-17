const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcryptjs')

// ──────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { usuario, contraseña }  ← acepta también "correo" en el campo usuario
// ──────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body

  if (!usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' })
  }

  try {
    // Buscar por usuario O por correo
    const result = await pool.query(
      `SELECT id, nombre, correo, usuario, rol, contraseña
       FROM usuarios
       WHERE (usuario = $1 OR correo = $1) AND deleted_at IS NULL
       LIMIT 1`,
      [usuario]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' })
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña)

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' })
    }

    // Devolvemos los datos del usuario (sin el hash de contraseña)
    const { contraseña: _, ...userSafe } = user
    res.json({ success: true, data: userSafe })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

module.exports = router
