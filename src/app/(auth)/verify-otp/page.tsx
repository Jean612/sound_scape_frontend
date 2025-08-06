'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Mail, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { authService } from '@/lib/api'

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos en segundos

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Redirigir si no hay email
  useEffect(() => {
    if (!email) {
      router.push('/register')
    }
  }, [email, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Solo permite un dígito

    const newOtpCode = [...otpCode]
    newOtpCode[index] = value

    setOtpCode(newOtpCode)
    setError('')

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Verificar automáticamente si todos los campos están llenos
    if (newOtpCode.every(digit => digit !== '') && newOtpCode.join('').length === 6) {
      handleVerifyOtp(newOtpCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (code: string) => {
    if (!email) return

    try {
      setIsLoading(true)
      setError('')

      await authService.verifyOtp(email, code)
      setIsSuccess(true)
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al verificar el código'
      setError(errorMessage)
      setOtpCode(['', '', '', '', '', '']) // Limpiar código
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) return

    try {
      setIsResending(true)
      setError('')

      await authService.resendOtp(email)
      setTimeLeft(15 * 60) // Reiniciar timer
      setOtpCode(['', '', '', '', '', '']) // Limpiar código
      inputRefs.current[0]?.focus()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al reenviar el código'
      setError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return <div className="text-center">Redirigiendo...</div>
  }

  if (isSuccess) {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          ¡Verificación Exitosa!
        </h1>
        
        <p className="text-slate-600 mb-6">
          Tu email ha sido confirmado correctamente. Serás redirigido al login...
        </p>
        
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Verifica tu Email
        </h1>
        <p className="text-slate-600">
          Ingresa el código de 6 dígitos que enviamos a
        </p>
        <p className="font-medium text-slate-900">{email}</p>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
          timeLeft > 300 
            ? 'bg-primary-50 text-primary-700' 
            : timeLeft > 60 
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
        }`}>
          <Clock className="w-4 h-4" />
          {timeLeft > 0 ? (
            <>El código expira en {formatTime(timeLeft)}</>
          ) : (
            <>El código ha expirado</>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error de verificación</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* OTP Input */}
      <div className="mb-8">
        <div className="flex justify-center gap-3 mb-6">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading || timeLeft <= 0}
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                digit 
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-300 hover:border-primary-300'
              } ${
                (isLoading || timeLeft <= 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Resend Button */}
      <div className="text-center mb-6">
        <p className="text-sm text-slate-600 mb-3">
          ¿No recibiste el código?
        </p>
        <button
          onClick={handleResendOtp}
          disabled={isResending || timeLeft > 840} // Deshabilitar si quedan más de 14 minutos
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
          {isResending ? 'Reenviando...' : 'Reenviar código'}
        </button>
      </div>

      {/* Back Links */}
      <div className="text-center space-y-3">
        <Link 
          href="/register"
          className="block text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Cambiar email
        </Link>
        <Link 
          href="/"
          className="block text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}