'use client'

import React from 'react'

interface LoadingSpinnerProps {
  message: string
  className?: string
}

export default function LoadingSpinner({ message, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Finola-Blue"></div>
        <p className="text-Pre-14-R text-Grayscale-B600">{message}</p>
      </div>
    </div>
  )
}
