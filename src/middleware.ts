import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/playlists', '/search']

// Rutas que solo usuarios no autenticados pueden acceder
const authOnlyRoutes = ['/login', '/register', '/verify-otp']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Si estás en una ruta protegida sin token, redirige a login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Si estás en login/register con token válido, redirige a dashboard
  if (authOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Si estás en la raíz con token válido, redirige a dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}