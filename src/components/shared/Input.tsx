'use client'

import React from 'react'

interface InputProps {
  id: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  className?: string
  inputClassName?: string
  error?: string
  disabled?: boolean
  helperText?: string
}

export default function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  className = '',
  inputClassName = '',
  error,
  disabled = false,
  helperText,
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-Pre-14-R text-Grayscale-B800 mb-1 font-pretendard"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error ? 'border-destructive' : 'border-Grayscale-B200'
        } rounded-md shadow-sm placeholder-Grayscale-B500 focus:outline-none focus:ring-Finola-Blue focus:border-Finola-Blue text-Pre-14-R font-pretendard ${
          disabled ? 'bg-Grayscale-B50 text-Grayscale-B500' : ''
        } ${inputClassName}`}
        required={required}
      />
      {helperText && (
        <p className="mt-1 text-Pre-12-R text-Grayscale-B600 font-pretendard">{helperText}</p>
      )}
      {error && <p className="mt-1 text-Pre-12-R text-destructive font-pretendard">{error}</p>}
    </div>
  )
}
