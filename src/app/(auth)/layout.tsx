import Link from 'next/link'
import { Music } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SoundScape</span>
          </Link>
          <p className="text-slate-600 mt-2">Tu plataforma de música inteligente</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 glass-effect">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>&copy; 2024 SoundScape. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}