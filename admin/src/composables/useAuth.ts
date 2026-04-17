import { ref } from 'vue'

const AUTH_KEY = 'bambu_user'

export interface AuthUser {
  id: number
  nombre: string
  correo: string
  usuario: string
  rol: string
}

// Estado reactivo global (singleton)
const currentUser = ref<AuthUser | null>(JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'))

export function useAuth() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  const login = async (usuario: string, contraseña: string): Promise<AuthUser> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contraseña }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Credenciales incorrectas')
    }
    currentUser.value = json.data
    localStorage.setItem(AUTH_KEY, JSON.stringify(json.data))
    return json.data
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(AUTH_KEY)
  }

  const isLoggedIn = () => !!currentUser.value

  return { currentUser, login, logout, isLoggedIn }
}
