// composables/useUsuarios.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface Usuario {
  id: number
  nombre: string
  correo: string
  usuario: string
  rol: string
  created_at?: string
  edited_at?: string
}

export interface UsuarioPayload {
  nombre: string
  correo: string
  usuario: string
  rol: string
  contraseña: string
}

async function handleResponse<T>(res: Response) {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`)
  return json as { success: boolean; data?: T; message?: string }
}

export function useUsuarios() {
  const getUsuarios = async (): Promise<Usuario[]> => {
    const res = await fetch(`${API_BASE}/usuarios`)
    const json = await handleResponse<Usuario[]>(res)
    return json.data || []
  }

  const getUsuario = async (id: number): Promise<Usuario> => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`)
    const json = await handleResponse<Usuario>(res)
    return json.data!
  }

  const crearUsuario = async (payload: UsuarioPayload): Promise<Usuario> => {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Usuario>(res)
    return json.data!
  }

  const actualizarUsuario = async (id: number, payload: Partial<UsuarioPayload>): Promise<Usuario> => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await handleResponse<Usuario>(res)
    return json.data!
  }

  const eliminarUsuario = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, { method: 'DELETE' })
    await handleResponse(res)
  }

  return { getUsuarios, getUsuario, crearUsuario, actualizarUsuario, eliminarUsuario }
}
