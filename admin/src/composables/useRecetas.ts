const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface RecetaIngrediente {
  id?: number
  producto: string
  unidad: string
  cantidad: number
  costo_calculado: number
}

export interface Receta {
  id: number
  nombre: string
  costo: number
  created_at: string
  ingredientes?: RecetaIngrediente[]
}

async function handleResponse<T>(res: Response) {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
  return json as { success: boolean; data?: T; message?: string }
}

export function useRecetas() {
  const getRecetas = async (): Promise<Receta[]> => {
    const res = await fetch(`${API_BASE}/recetas`)
    const json = await handleResponse<Receta[]>(res)
    return json.data || []
  }

  const getReceta = async (id: number): Promise<Receta | null> => {
    const res = await fetch(`${API_BASE}/recetas/${id}`)
    const json = await handleResponse<Receta>(res)
    return json.data || null
  }

  const crearReceta = async (
    nombre: string,
    ingredientes: RecetaIngrediente[]
  ): Promise<Receta> => {
    const res = await fetch(`${API_BASE}/recetas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, ingredientes }),
    })
    const json = await handleResponse<Receta>(res)
    return json.data!
  }

  const actualizarReceta = async (
    id: number,
    ingredientes: RecetaIngrediente[]
  ): Promise<void> => {
    const res = await fetch(`${API_BASE}/recetas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredientes }),
    })
    await handleResponse(res)
  }

  const eliminarReceta = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/recetas/${id}`, { method: 'DELETE' })
    await handleResponse(res)
  }

  return { getRecetas, getReceta, crearReceta, actualizarReceta, eliminarReceta }
}
