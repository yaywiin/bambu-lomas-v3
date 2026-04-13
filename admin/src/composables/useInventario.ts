const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface InventarioItem {
  id: number
  producto: string
  tipo: string
  existencia: number
  u_m: string
  costo_promedio: number
  ultima_compra: string
}

async function handleResponse<T>(res: Response) {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
  return json as { success: boolean; data?: T }
}

export function useInventario() {
  const getInventario = async (): Promise<InventarioItem[]> => {
    const res = await fetch(`${API_BASE}/inventario`)
    const json = await handleResponse<InventarioItem[]>(res)
    return json.data || []
  }

  return { getInventario }
}
