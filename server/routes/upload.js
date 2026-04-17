const express = require('express')
const router = express.Router()
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

// ── Configurar Cloudinary ────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── Storage: sube directamente a Cloudinary ──────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:         'bambu-lomas/carta',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto:good' }],
  }),
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB máx
})

// ── POST /api/upload/single ──────────────────────────────────
// Sube una sola imagen y devuelve su URL segura.
// Body: multipart/form-data  campo "imagen"
router.post('/single', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se recibió ningún archivo.' })
  }
  return res.json({
    success: true,
    url: req.file.path,          // URL segura de Cloudinary
    public_id: req.file.filename // public_id por si se necesita borrar después
  })
})

// ── POST /api/upload/multiple ────────────────────────────────
// Sube hasta 10 imágenes y devuelve array de URLs.
// Body: multipart/form-data  campo "imagenes" (múltiples)
router.post('/multiple', upload.array('imagenes', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No se recibieron archivos.' })
  }
  const urls = req.files.map(f => ({ url: f.path, public_id: f.filename }))
  return res.json({ success: true, data: urls })
})

// ── DELETE /api/upload/:publicId ─────────────────────────────
// Elimina una imagen de Cloudinary dado su public_id (urlencoded).
// Usamos wildcard {*publicId} para capturar public_ids con slashes (e.g. "bambu-lomas/carta/abc123")
router.delete('/{*publicId}', async (req, res) => {
  const publicId = req.params.publicId
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(500).json({ success: false, message: 'No se pudo eliminar la imagen.', result })
    }
    return res.json({ success: true, message: 'Imagen eliminada.', result })
  } catch (err) {
    console.error('Error al eliminar imagen:', err)
    return res.status(500).json({ success: false, message: 'Error al eliminar imagen.', error: err.message })
  }
})

module.exports = router
