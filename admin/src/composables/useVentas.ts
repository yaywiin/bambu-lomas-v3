import { ref, watch } from 'vue'

export interface VentaItem {
  cantidad: number
  descripcion: string
  precio: number
}

export interface Venta {
  orden: string
  cliente: string
  fecha: string
  horaPedido: string
  horaEntrega: string
  items: VentaItem[]
  total: number
  formaPago: string
  cajero: string
  mesa?: number | null
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'bambu_ventas'

// Estado global reactivo (singleton) — se inicializa vacío y carga desde API
const ventas = ref<Venta[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

// Persistencia local de respaldo
watch(ventas, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useVentas() {
  // ── Cargar ventas desde la BD (con filtro opcional por cajero) ──
  const cargarVentas = async (cajero?: string) => {
    try {
      const url = cajero
        ? `${API_BASE}/ventas?cajero=${encodeURIComponent(cajero)}`
        : `${API_BASE}/ventas`
      const res = await fetch(url)
      const json = await res.json()
      if (json.success) {
        ventas.value = json.data.map((v: any): Venta => ({
          orden: v.folio,
          cliente: v.cliente,
          fecha: new Date(v.hora_pedido).toLocaleDateString('es-GT'),
          horaPedido: new Date(v.hora_pedido).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
          horaEntrega: new Date(v.hora_cierre).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
          items: (v.items || []).map((i: any) => ({
            cantidad: i.cantidad,
            descripcion: i.descripcion,
            precio: i.precio,
          })),
          total: parseFloat(v.total),
          formaPago: v.forma_pago,
          cajero: v.cajero,
          mesa: v.mesa,
        }))
      }
    } catch (err) {
      console.warn('[useVentas] No se pudo conectar a la API, usando localStorage.', err)
      // El estado ya tiene los datos locales, no hacemos nada
    }
  }

  // ── Registrar una venta (BD primero, fallback local) ──
  const registrarVenta = async (
    venta: Omit<Venta, 'orden' | 'fecha' | 'horaEntrega'> & { orden?: string }
  ): Promise<Venta> => {
    const ahora = new Date()
    const fecha = ahora.toLocaleDateString('es-GT')
    const hora = ahora.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    const folio = venta.orden || `ORD-${1000 + ventas.value.length + 1}`

    const nuevaVenta: Venta = {
      orden: folio,
      cliente: venta.cliente || 'Cliente General',
      fecha,
      horaPedido: venta.horaPedido || hora,
      horaEntrega: hora,
      items: venta.items,
      total: venta.total,
      formaPago: venta.formaPago,
      cajero: venta.cajero,
      mesa: venta.mesa ?? null,
    }

    // Intentar guardar en la BD
    try {
      await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folio: nuevaVenta.orden,
          cliente: nuevaVenta.cliente,
          cajero: nuevaVenta.cajero,
          forma_pago: nuevaVenta.formaPago,
          total: nuevaVenta.total,
          mesa: nuevaVenta.mesa,
          items: nuevaVenta.items,
        }),
      })
    } catch (err) {
      console.warn('[useVentas] No se pudo guardar en BD, solo en localStorage.', err)
    }

    // Siempre guardamos localmente también
    ventas.value = [nuevaVenta, ...ventas.value]
    return nuevaVenta
  }

  return { ventas, registrarVenta, cargarVentas }
}
