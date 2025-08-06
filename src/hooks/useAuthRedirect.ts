'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth'

export function useAuthRedirect() {
  // const router = useRouter() // Not currently used but may be needed for future navigation
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuario autenticado - redirigir a dashboard
        const timer = setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
        
        return () => clearTimeout(timer)
      } else if (!isAuthenticated && !user) {
        // Usuario no autenticado - asegurarse de que esté en página correcta
        const currentPath = window.location.pathname
        const isAuthPage = currentPath.startsWith('/login') || 
                          currentPath.startsWith('/register') || 
                          currentPath.startsWith('/verify-otp')
        
        if (!isAuthPage && currentPath !== '/') {
          window.location.href = '/'
        }
      }
    }
  }, [isAuthenticated, user, isLoading])

  return {
    isAuthenticated,
    user,
    isLoading,
    shouldRedirect: isAuthenticated && user && !isLoading
  }
}