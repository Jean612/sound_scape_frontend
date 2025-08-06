'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Music, Play, MoreVertical, Trash2, Clock, User, Calendar } from 'lucide-react'
import { playlistService, type Playlist, type PlaylistSong } from '@/lib/api'
import { useAuthStore } from '@/lib/stores/auth'
import Link from 'next/link'

export default function PlaylistDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadPlaylist(Number(id))
    }
  }, [id])

  const loadPlaylist = async (playlistId: number) => {
    try {
      setError('')
      const data = await playlistService.getById(playlistId)
      setPlaylist(data)
    } catch (error: unknown) {
      setError('Error al cargar la playlist')
      console.error('Error loading playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveSong = async (playlistSongId: number) => {
    if (!playlist) return

    if (!confirm('¿Estás seguro de que quieres eliminar esta canción de la playlist?')) {
      return
    }

    try {
      await playlistService.removeSong(playlist.id, playlistSongId)
      // Actualizar la playlist local
      setPlaylist(prev => {
        if (!prev) return prev
        return {
          ...prev,
          songs: prev.songs?.filter(ps => ps.id !== playlistSongId) || [],
          songs_count: (prev.songs_count || 1) - 1
        }
      })
    } catch {
      setError('Error al eliminar la canción')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTotalDuration = () => {
    if (!playlist?.songs) return '0:00'
    const totalSeconds = playlist.songs.reduce((total, ps) => total + ps.song.duration_seconds, 0)
    const minutes = Math.floor(totalSeconds / 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}:${(totalSeconds % 60).toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PlaylistHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!playlist || error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PlaylistHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {error || 'Playlist no encontrada'}
            </h2>
            <Link href="/dashboard" className="btn-primary">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PlaylistHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {/* Botón de volver */}
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Playlists
          </Link>

          {/* Header de la playlist */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Music className="w-16 h-16 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium mb-2">Playlist</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 break-words">
                  {playlist.name}
                </h1>
                
                {playlist.description && (
                  <p className="text-white/90 text-lg mb-4 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="w-4 h-4" />
                    <span>{playlist.songs_count || 0} canciones</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTotalDuration()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(playlist.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-4 mt-6">
              <button className="w-14 h-14 bg-primary-400 hover:bg-primary-300 rounded-full flex items-center justify-center transition-colors">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
              <Link
                href={`/search?playlist=${playlist.id}`}
                className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              >
                Agregar canciones
              </Link>
            </div>
          </div>

          {/* Lista de canciones */}
          <div className="bg-white rounded-xl shadow-sm">
            {playlist.songs && playlist.songs.length > 0 ? (
              <>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-slate-900">
                    Canciones ({playlist.songs.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-50">
                  {playlist.songs
                    .sort((a, b) => a.position - b.position)
                    .map((playlistSong, index) => (
                      <SongRow
                        key={playlistSong.id}
                        playlistSong={playlistSong}
                        index={index}
                        onRemove={handleRemoveSong}
                      />
                    ))
                  }
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Esta playlist está vacía
                </h3>
                <p className="text-slate-600 mb-6">
                  Agrega algunas canciones para comenzar a disfrutar de tu música
                </p>
                <Link
                  href={`/search?playlist=${playlist.id}`}
                  className="btn-primary"
                >
                  Buscar canciones
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaylistHeader() {
  const { user } = useAuthStore()
  const logout = useAuthStore(state => state.logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
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
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
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
              disabled={isLoggingOut}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  Cerrando...
                </>
              ) : (
                'Cerrar Sesión'
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function SongRow({ 
  playlistSong, 
  index, 
  onRemove 
}: { 
  playlistSong: PlaylistSong
  index: number
  onRemove: (id: number) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const { song } = playlistSong

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
      {/* Número de track */}
      <div className="w-8 text-center">
        <span className="text-slate-400 group-hover:hidden">{index + 1}</span>
        <Play className="w-4 h-4 text-primary-600 hidden group-hover:block mx-auto cursor-pointer" />
      </div>

      {/* Información de la canción */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-900 line-clamp-1">
          {song.title}
        </h4>
        <p className="text-sm text-slate-600 line-clamp-1">
          {song.artist}
          {song.album && (
            <>
              {' • '}
              <span>{song.album}</span>
            </>
          )}
        </p>
      </div>

      {/* Duración */}
      <div className="text-sm text-slate-500 w-16 text-right">
        {formatDuration(song.duration_seconds)}
      </div>

      {/* Menú de acciones */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            <button
              onClick={() => {
                onRemove(playlistSong.id)
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar de la playlist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}