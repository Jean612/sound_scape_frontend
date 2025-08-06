'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showPasswordToggle?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, showPasswordToggle, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle && showPassword ? 'text' : type

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'input',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              showPasswordToggle && 'pr-12',
              className
            )}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export { FormInput }