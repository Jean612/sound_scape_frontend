'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { Music, Sparkles, Users, Zap, Play, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  const { isLoading, shouldRedirect } = useAuthRedirect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mostrar loading hasta que el componente esté montado
  if (!mounted || isLoading || shouldRedirect) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  }

  return <LandingPage />
}

function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SoundScape</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn-primary">
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Tu música, <span className="gradient-text">inteligente</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre nuevas canciones, crea playlists personalizadas y organiza tu música 
            con la ayuda de inteligencia artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Comenzar Gratis
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
              Conocer más
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="card p-8 glass-effect">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-primary-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-100 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-primary-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-300 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-primary-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-primary-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-center mt-6 text-primary-600 font-medium">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Vista previa de la aplicación
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para tu <span className="gradient-text">música</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Funciones inteligentes diseñadas para mejorar tu experiencia musical
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Búsqueda Inteligente"
              description="Encuentra canciones perfectas usando descripciones naturales. Di 'algo relajante para estudiar' y nosotros nos encargamos."
            />
            
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Playlists Personalizadas"
              description="Crea y organiza tus listas de reproducción con facilidad. Agrega canciones directamente desde los resultados de búsqueda AI."
            />
            
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Experiencia Rápida"
              description="Interfaz moderna y responsive que funciona perfectamente en todos tus dispositivos. Diseñada para la velocidad."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="card max-w-2xl mx-auto p-12">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Únete a miles de usuarios que ya disfrutan de una experiencia musical inteligente
            </p>
            <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <Star className="w-5 h-5" />
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2024 SoundScape. Hecho con ❤️ para los amantes de la música.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card p-6 text-center hover:scale-105 transition-transform duration-200">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

// Unused component removed to fix build errors
// DashboardHome functionality is available in /dashboard page