import { ref, watch } from 'vue'

export interface OrdenItem {
  id: string
  cantidad: number
  producto: string
  precio: number
  extras: string[]
  extrasStr: string
}

export interface Mesa {
  id: number
  estado: 'libre' | 'ocupada'
  orden: OrdenItem[]
}

const STORAGE_KEY = 'bambu_mesas_state'

// Estado global para las Mesas
const mesas = ref<Mesa[]>([])

// Inicializador
const initMesas = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      mesas.value = JSON.parse(stored)
      return
    } catch (e) {
      console.error('Error parseando mesas del localStorage', e)
    }
  }
  // Si no hay nada, generamos 15 mesas por defecto
  mesas.value = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    estado: 'libre',
    orden: []
  }))
}

initMesas()

// Observamos cambios de forma persistente
watch(
  mesas,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)

export function useMesas() {
  const obtenerMesa = (id: number) => {
    return mesas.value.find(m => m.id === id)
  }

  const ocuparMesa = (id: number) => {
    const mesa = obtenerMesa(id)
    if (mesa && mesa.estado === 'libre') {
      mesa.estado = 'ocupada'
      mesa.orden = [] // Limpiamos para iniciar orden nueva
    }
  }

  const liberarMesa = (id: number) => {
    const mesa = obtenerMesa(id)
    if (mesa) {
      mesa.estado = 'libre'
      mesa.orden = []
    }
  }

  const actualizarOrdenMesa = (id: number, ordenNueva: OrdenItem[]) => {
    const mesa = obtenerMesa(id)
    if (mesa) {
      mesa.orden = [...ordenNueva]
      // Si se le agregan cosas y estaba libre, la marcamos ocupada
      if (mesa.estado === 'libre' && ordenNueva.length > 0) {
        mesa.estado = 'ocupada'
      }
    }
  }

  return {
    mesas,
    obtenerMesa,
    ocuparMesa,
    liberarMesa,
    actualizarOrdenMesa
  }
}
