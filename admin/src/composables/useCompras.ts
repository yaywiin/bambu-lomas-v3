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

export interface Renglon {
  id: number
  compra_id: number
  producto: string
  tipo_producto: string
  unidad_medida: string
  cantidad: number
  precio_unitario: number
  descuento: number
  total: number
}

export interface RenglonPayload {
  producto: string
  tipo_producto: string
  unidad_medida: string
  cantidad: number
  precio_unitario: number
  descuento: number
  total: number
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

  const getCompra = async (id: number): Promise<Compra> => {
    const res = await fetch(`${API_BASE}/compras/${id}`)
    const json = await handleResponse<Compra>(res)
    return json.data!
  }

  // ── Renglones (Desglose) ────────────────────────────────────
  const getRenglones = async (compraId: number): Promise<Renglon[]> => {
    const res = await fetch(`${API_BASE}/compras/${compraId}/desglose`)
    const json = await handleResponse<Renglon[]>(res)
    return json.data || []
  }

  const crearRenglon = async (compraId: number, payload: RenglonPayload): Promise<Renglon> => {
    const res = await fetch(`${API_BASE}/compras/${compraId}/desglose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Renglon>(res)
    return json.data!
  }

  const eliminarRenglon = async (compraId: number, renglonId: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/compras/${compraId}/desglose/${renglonId}`, { method: 'DELETE' })
    await handleResponse(res)
  }

  return { getCompras, getCompra, crearCompra, actualizarCompra, eliminarCompra, getRenglones, crearRenglon, eliminarRenglon }
}
