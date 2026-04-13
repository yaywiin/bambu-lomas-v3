const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface Gasto {
  id: number
  concepto: string
  fecha_pago: string
  monto: number
  pagado_a: string
  forma_pago: string
  created_at?: string
  edited_at?: string
}

export interface GastoPayload {
  concepto: string
  fechaPago: string
  monto: number
  pagadoA: string
  formaPago: string
}

async function handleResponse<T>(res: Response) {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
  return json as { success: boolean; data?: T; message?: string }
}

export function useGastos() {
  const getGastos = async (): Promise<Gasto[]> => {
    const res = await fetch(`${API_BASE}/gastos`)
    const json = await handleResponse<Gasto[]>(res)
    return json.data || []
  }

  const crearGasto = async (payload: GastoPayload): Promise<Gasto> => {
    const res = await fetch(`${API_BASE}/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Gasto>(res)
    return json.data!
  }

  const actualizarGasto = async (id: number, payload: GastoPayload): Promise<Gasto> => {
    const res = await fetch(`${API_BASE}/gastos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Gasto>(res)
    return json.data!
  }

  const eliminarGasto = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/gastos/${id}`, { method: 'DELETE' })
    await handleResponse(res)
  }

  return { getGastos, crearGasto, actualizarGasto, eliminarGasto }
}
