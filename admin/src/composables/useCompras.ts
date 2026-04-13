const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface Compra {
  id: number           // es el ticket
  proveedor: string
  'forma-pago': string
  fecha_compra: string // DATE → 'YYYY-MM-DD'
  total: number
  created_at?: string
  edited_at?: string
}

export interface CompraPayload {
  id: number
  proveedor: string
  formaPago: string
  fechaCompra: string
  total: number
}

async function handleResponse<T>(res: Response) {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
  return json as { success: boolean; data?: T; message?: string }
}

export function useCompras() {
  const getCompras = async (): Promise<Compra[]> => {
    const res = await fetch(`${API_BASE}/compras`)
    const json = await handleResponse<Compra[]>(res)
    return json.data || []
  }

  const crearCompra = async (payload: CompraPayload): Promise<Compra> => {
    const res = await fetch(`${API_BASE}/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Compra>(res)
    return json.data!
  }

  const actualizarCompra = async (id: number, payload: CompraPayload): Promise<Compra> => {
    const res = await fetch(`${API_BASE}/compras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Compra>(res)
    return json.data!
  }

  const eliminarCompra = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/compras/${id}`, { method: 'DELETE' })
    await handleResponse(res)
  }

  return { getCompras, crearCompra, actualizarCompra, eliminarCompra }
}
