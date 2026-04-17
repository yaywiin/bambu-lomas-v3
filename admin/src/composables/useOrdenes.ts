import { ref, watch, onMounted, onUnmounted } from 'vue'

export type EstadoOrden = 'recibido' | 'preparacion' | 'listo' | 'cobrado' | 'cancelado'

export interface OrdenRemotaItem {
  producto: string
  cantidad: number
  precio: number
  extras?: string[]
}

export interface OrdenRemota {
  id: string
  cliente: string
  estado: EstadoOrden
  fecha_pedido: string
  items: OrdenRemotaItem[]
  origen: 'App Cliente' | 'UberEats' | 'Telefono'
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const ordenes = ref<OrdenRemota[]>([])
let pollInterval: any = null

const fetchOrdenes = async () => {
  try {
    const res = await fetch(`${API_BASE}/ordenes_remotas`)
    if (res.ok) {
      const json = await res.json()
      if (json.success) {
        ordenes.value = json.data
      }
    }
  } catch (err) {
    console.error('Error fetching ordenes remotas:', err)
  }
}

// Inicializar el polling
const initPolling = () => {
  if (pollInterval) clearInterval(pollInterval)
  fetchOrdenes()
  // Recargar cada 5 segundos
  pollInterval = setInterval(fetchOrdenes, 5000)
}

export function useOrdenes() {
  // Solo iniciar si estamos en navegador
  if (typeof window !== 'undefined' && !pollInterval) {
    initPolling()
  }

  const cambiarEstado = async (id: string, nuevoEstado: EstadoOrden) => {
    // Actualización optimista
    const orden = ordenes.value.find(o => o.id === id)
    if (orden) {
      orden.estado = nuevoEstado
    }
    
    // Si estado final, quiza preferimos hacer DELETE. Para mantener el flujo, actualizamos a 'cobrado' (se ocultará visualmente o podemos hacer DELETE)
    // En el mock local de routes/ordenes_remotas, hacemos PUT
    try {
      if (nuevoEstado === 'cobrado' || nuevoEstado === 'cancelado') {
         await fetch(`${API_BASE}/ordenes_remotas/${id}`, { method: 'DELETE' })
      } else {
         await fetch(`${API_BASE}/ordenes_remotas/${id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ estado: nuevoEstado })
         })
      }
      fetchOrdenes()
    } catch (err) {
       console.error('Error actualizando orden:', err)
    }
  }

  const obtenerOrden = (id: string) => {
    return ordenes.value.find(o => o.id === id)
  }

  const eliminarOrden = async (id: string) => {
    ordenes.value = ordenes.value.filter(o => o.id !== id)
    try {
      await fetch(`${API_BASE}/ordenes_remotas/${id}`, { method: 'DELETE' })
    } catch (err) {
       console.error('Error eliminando orden:', err)
    }
  }

  return { ordenes, cambiarEstado, obtenerOrden, eliminarOrden }
}
