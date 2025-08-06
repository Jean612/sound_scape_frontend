// Utilidad para manejar cookies de manera más segura

export const cookieUtils = {
  set: (name: string, value: string, days: number = 7) => {
    if (typeof document === 'undefined') return
    
    const maxAge = days * 24 * 60 * 60 // convertir días a segundos
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`
  },

  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  remove: (name: string) => {
    if (typeof document === 'undefined') return
    
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`
  },

  exists: (name: string): boolean => {
    return cookieUtils.get(name) !== null
  }
}