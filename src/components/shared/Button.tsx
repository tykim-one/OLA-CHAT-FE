'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none font-pretendard'

  const variantStyles = {
    primary: 'bg-Finola-Blue text-white hover:bg-Finola-Blue100',
    secondary: 'bg-Grayscale-B70 text-Grayscale-B800 hover:bg-Grayscale-B100',
    outline: 'border border-Grayscale-B200 bg-white text-Grayscale-B800 hover:bg-Grayscale-B50',
    blue: 'bg-gradient-to-b from-Finola-Blue0 to-Finola-Blue100 text-white hover:opacity-90',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-Pre-14-R',
    md: 'px-4 py-2 text-Pre-16-R',
    lg: 'px-5 py-2.5 text-Pre-18-R',
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
