'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'
import { FormInput } from '@/components/forms/FormInput'
import { useForm } from '@/hooks/useForm'
import { useAuthStore } from '@/lib/stores/auth'

interface LoginForm {
  email: string
  password: string
}

const validateLogin = (values: LoginForm) => {
  const errors: Partial<Record<keyof LoginForm, string>> = {}

  if (!values.email) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'El email no es válido'
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return errors
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore(state => state.login)
  const [submitError, setSubmitError] = useState('')

  const {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
    onSubmit: async (values) => {
      try {
        setSubmitError('')
        await login(values.email, values.password)
        // Dar tiempo para que el estado se actualice
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message || 'Error al iniciar sesión')
        } else {
          setSubmitError('Error inesperado. Por favor, intenta de nuevo.')
        }
      }
    },
  })

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-slate-600">
          Accede a tu cuenta para continuar
        </p>
      </div>

      {/* Error General */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error al iniciar sesión</p>
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="tu@email.com"
          disabled={isLoading}
          autoComplete="email"
        />

        <FormInput
          label="Contraseña"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Tu contraseña"
          showPasswordToggle
          disabled={isLoading}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </>
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-slate-600">
          ¿No tienes una cuenta?{' '}
          <Link 
            href="/register" 
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Enlaces adicionales */}
      <div className="mt-4 text-center">
        <Link 
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}