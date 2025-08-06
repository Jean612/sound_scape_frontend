'use client'

import { useState, useEffect } from 'react'
import { Plus, Music, MoreVertical, Trash2, Edit, Play, Clock } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { playlistService, type Playlist } from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState('')

  // Cargar playlists del usuario
  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      setError('')
      const data = await playlistService.getAll()
      setPlaylists(data)
    } catch (error: unknown) {
      setError('Error al cargar las playlists')
      console.error('Error loading playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePlaylist = async (playlistData: { name: string; description?: string }) => {
    try {
      setIsCreating(true)
      const newPlaylist = await playlistService.create(playlistData)
      setPlaylists(prev => [newPlaylist, ...prev])
      setShowCreateModal(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la playlist'
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta playlist?')) {
      return
    }

    try {
      await playlistService.delete(playlistId)
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la playlist'
      setError(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {/* Header con botón de crear */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Mis Playlists
              </h1>
              <p className="text-slate-600">
                Gestiona tus listas de reproducción y descubre nueva música
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Playlist
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Lista de playlists */}
          {playlists.length === 0 ? (
            <EmptyState onCreateClick={() => setShowCreateModal(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onDelete={handleDeletePlaylist}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de crear playlist */}
      {showCreateModal && (
        <CreatePlaylistModal
          isLoading={isCreating}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlaylist}
        />
      )}
    </div>
  )
}

function DashboardHeader({ user }: { user: { name: string } | null }) {
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SoundScape</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-primary-600 font-medium"
            >
              Mis Playlists
            </Link>
            <Link 
              href="/search" 
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Búsqueda AI
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-slate-600">
              ¡Hola, {user?.name}!
            </span>
            <button 
              onClick={handleLogout}
              className="btn-secondary"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Music className="w-12 h-12 text-primary-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        ¡Comienza tu colección musical!
      </h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Aún no tienes playlists. Crea tu primera lista de reproducción y comienza a organizar tu música favorita.
      </p>
      
      <button
        onClick={onCreateClick}
        className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Crear mi primera playlist
      </button>
    </div>
  )
}

function PlaylistCard({ 
  playlist, 
  onDelete 
}: { 
  playlist: Playlist
  onDelete: (id: number) => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="card p-0 hover:scale-105 transition-transform duration-200 group">
      {/* Imagen/Preview de la playlist */}
      <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        <Music className="w-16 h-16 text-white/80" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform duration-200">
            <Play className="w-6 h-6 text-primary-600 ml-1" />
          </button>
        </div>
        
        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <Link
                href={`/playlists/${playlist.id}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <Edit className="w-4 h-4" />
                Editar playlist
              </Link>
              <button
                onClick={() => {
                  onDelete(playlist.id)
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar playlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        <Link href={`/playlists/${playlist.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-primary-600 transition-colors line-clamp-1">
            {playlist.name}
          </h3>
        </Link>
        
        {playlist.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {playlist.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            <span>{playlist.songs_count || 0} canciones</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(playlist.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatePlaylistModal({
  isLoading,
  onClose,
  onSubmit
}: {
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('El nombre de la playlist es obligatorio')
      return
    }

    setError('')
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Nueva Playlist
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="playlist-name" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
              </label>
              <input
                id="playlist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi nueva playlist"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="playlist-description" className="block text-sm font-medium text-slate-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                id="playlist-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu playlist..."
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Crear
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}