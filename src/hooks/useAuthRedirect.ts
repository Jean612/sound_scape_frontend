'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth'

export function useAuthRedirect() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, isLoading])

  return {
    isAuthenticated,
    user,
    isLoading,
    shouldRedirect: isAuthenticated && user && !isLoading
  }
}