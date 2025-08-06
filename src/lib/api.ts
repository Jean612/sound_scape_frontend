import axios from 'axios'

// Configuración base del cliente API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir a login si estamos en una ruta protegida y el token es inválido
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/register')
      
      if (!isAuthPage) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    // Mejorar mensajes de error
    if (error.response?.data) {
      const errorData = error.response.data
      if (errorData.error) {
        error.message = errorData.error
      } else if (errorData.errors) {
        error.message = Array.isArray(errorData.errors) 
          ? errorData.errors.join(', ')
          : errorData.errors
      }
    }
    
    return Promise.reject(error)
  }
)

// Tipos TypeScript
export interface User {
  id: number
  email: string
  name: string
  username: string
  country: string
  birth_date: string
  email_confirmed: boolean
}

export interface Song {
  id: number
  title: string
  artist: string
  album?: string
  duration_seconds: number
}

export interface Playlist {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
  songs_count: number
  songs?: PlaylistSong[]
}

export interface PlaylistSong {
  id: number
  position: number
  song: Song
}

export interface AiSongSuggestion {
  title: string
  artist: string
  album?: string
  year?: number
  genre?: string
  duration: string
  relevance_score: number
}

// Servicios de autenticación
export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', {
      user: {
        email,
        password,
      }
    })
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Establecer cookie para el middleware
      document.cookie = `auth_token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 días
    }
    
    return response.data
  },

  async register(userData: {
    email: string
    password: string
    name: string
    username: string
    country: string
    birth_date: string
  }) {
    const response = await apiClient.post('/auth/register', {
      user: userData
    })
    return response.data
  },

  async verifyOtp(email: string, otpCode: string) {
    const response = await apiClient.post('/auth/verify_otp', {
      email,
      otp_code: otpCode,
    })
    return response.data
  },

  async resendOtp(email: string) {
    const response = await apiClient.post('/auth/resend_otp', {
      email,
    })
    return response.data
  },

  async resendConfirmation(email: string) {
    const response = await apiClient.post('/auth/resend_confirmation', {
      email,
    })
    return response.data
  },

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // Limpiar cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  },
}

// Servicios de playlists
export const playlistService = {
  async getAll(): Promise<Playlist[]> {
    const response = await apiClient.get('/playlists')
    return response.data.playlists
  },

  async getById(id: number): Promise<Playlist> {
    const response = await apiClient.get(`/playlists/${id}`)
    return response.data.playlist
  },

  async create(data: { name: string; description?: string }): Promise<Playlist> {
    const response = await apiClient.post('/playlists', data)
    return response.data.playlist
  },

  async update(id: number, data: { name: string; description?: string }): Promise<Playlist> {
    const response = await apiClient.patch(`/playlists/${id}`, data)
    return response.data.playlist
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/playlists/${id}`)
  },

  async addSong(playlistId: number, songId: number): Promise<PlaylistSong> {
    const response = await apiClient.post(`/playlists/${playlistId}/songs`, {
      song_id: songId,
    })
    return response.data.playlist_song
  },

  async removeSong(playlistId: number, playlistSongId: number): Promise<void> {
    await apiClient.delete(`/playlists/${playlistId}/songs/${playlistSongId}`)
  },

  async addAiSong(playlistId: number, songData: AiSongSuggestion): Promise<PlaylistSong> {
    const response = await apiClient.post(`/playlists/${playlistId}/add_ai_song`, {
      song: songData,
    })
    return response.data.playlist_song
  },
}

// Servicios de canciones
export const songService = {
  async getAll(): Promise<Song[]> {
    const response = await apiClient.get('/songs')
    return response.data.songs
  },

  async create(data: {
    title: string
    artist: string
    album?: string
    duration_seconds: number
  }): Promise<Song> {
    const response = await apiClient.post('/songs', data)
    return response.data.song
  },
}

// Servicios de búsqueda con AI
export const aiSearchService = {
  async search(query: string, limit = 10): Promise<AiSongSuggestion[]> {
    const response = await apiClient.post('/ai_search', {
      query,
      limit,
    })
    return response.data.songs
  },

  async getTrending(limit = 20) {
    const response = await apiClient.get(`/ai_search/trending?limit=${limit}`)
    return response.data
  },

  async getHistory(limit = 50) {
    const response = await apiClient.get(`/ai_search/history?limit=${limit}`)
    return response.data
  },
}