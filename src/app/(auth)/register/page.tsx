'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { UserPlus, Loader2, AlertCircle } from 'lucide-react'
import { FormInput } from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import { useForm } from '@/hooks/useForm'
import { authService } from '@/lib/api'

interface RegisterForm extends Record<string, unknown> {
  email: string
  password: string
  confirmPassword: string
  name: string
  username: string
  country: string
  birth_date: string
}

// Lista de países
const countries = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BR', label: 'Brasil' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CU', label: 'Cuba' },
  { value: 'DO', label: 'República Dominicana' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'ES', label: 'España' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'MX', label: 'México' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panamá' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Perú' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'CA', label: 'Canadá' },
  { value: 'OTHER', label: 'Otro' },
]

const validateRegister = (values: RegisterForm) => {
  const errors: Partial<Record<keyof RegisterForm, string>> = {}

  // Email validation
  if (!values.email) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'El email no es válido'
  }

  // Password validation
  if (!values.password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  // Name validation
  if (!values.name) {
    errors.name = 'El nombre es obligatorio'
  } else if (values.name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres'
  }

  // Username validation
  if (!values.username) {
    errors.username = 'El nombre de usuario es obligatorio'
  } else if (values.username.length < 3) {
    errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
    errors.username = 'Solo se permiten letras, números y guiones bajos'
  }

  // Country validation
  if (!values.country) {
    errors.country = 'Selecciona tu país'
  }

  // Birth date validation
  if (!values.birth_date) {
    errors.birth_date = 'La fecha de nacimiento es obligatoria'
  } else {
    const birthDate = new Date(values.birth_date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 13) {
      errors.birth_date = 'Debes tener al menos 13 años'
    }
  }

  return errors
}

export default function RegisterPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState('')

  const {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useForm<RegisterForm>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      username: '',
      country: '',
      birth_date: '',
    },
    validate: validateRegister,
    onSubmit: async (values) => {
      try {
        setSubmitError('')
        
        // Preparar datos para el API
        const userData = {
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
          country: values.country,
          birth_date: values.birth_date,
        }

        await authService.register(userData)
        // Redirigir a verificación OTP
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`)
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { errors: unknown } } }
          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors
            if (Array.isArray(serverErrors)) {
              setSubmitError(serverErrors.join(', '))
            } else {
              setSubmitError(String(serverErrors))
            }
          }
        } else if (error instanceof Error) {
          setSubmitError(error.message)
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
          Crear nueva cuenta
        </h1>
        <p className="text-slate-600">
          Únete a SoundScape y descubre nueva música
        </p>
      </div>

      {/* Error General */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error al registrarse</p>
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nombre completo"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Juan Pérez"
            disabled={isLoading}
            autoComplete="name"
          />

          <FormInput
            label="Nombre de usuario"
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="juanperez"
            disabled={isLoading}
            autoComplete="username"
          />
        </div>

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="juan@email.com"
          disabled={isLoading}
          autoComplete="email"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="País"
            name="country"
            value={values.country}
            onChange={handleChange}
            error={errors.country}
            options={countries}
            placeholder="Selecciona tu país"
            disabled={isLoading}
          />

          <FormInput
            label="Fecha de nacimiento"
            name="birth_date"
            type="date"
            value={values.birth_date}
            onChange={handleChange}
            error={errors.birth_date}
            disabled={isLoading}
          />
        </div>

        <FormInput
          label="Contraseña"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Mínimo 6 caracteres"
          showPasswordToggle
          disabled={isLoading}
          autoComplete="new-password"
        />

        <FormInput
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          showPasswordToggle
          disabled={isLoading}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Crear Cuenta
            </>
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            href="/login" 
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Inicia sesión
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