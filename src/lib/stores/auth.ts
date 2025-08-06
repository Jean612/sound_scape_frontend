import { create } from 'zustand'
import { User, authService } from '../api'
import { cookieUtils } from '../cookies'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Acciones
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true })
      const response = await authService.login(email, password)
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    authService.logout()
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    
    // Redirigir al landing después de logout
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  checkAuth: () => {
    if (typeof window === 'undefined') return
    
    try {
      const token = localStorage.getItem('auth_token')
      const user = authService.getCurrentUser()
      
      // Si hay token pero no cookie, establecer cookie
      if (token && user && !cookieUtils.exists('auth_token')) {
        cookieUtils.set('auth_token', token, 7) // 7 días
      }
      
      set({
        user,
        isAuthenticated: !!token && !!user,
      })
    } catch {
      // Si hay error, limpia el estado
      set({
        user: null,
        isAuthenticated: false,
      })
      // Limpiar cookie también
      cookieUtils.remove('auth_token')
    }
  },
}))