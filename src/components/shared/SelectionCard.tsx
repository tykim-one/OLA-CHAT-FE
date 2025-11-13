'use client'

import Image from 'next/image'
import React from 'react'

interface SelectionCardProps {
  title: string
  description: string
  icon: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function SelectionCard({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}: SelectionCardProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        p-3 rounded-lg transition-all w-full border-[4px] max-w-[270px]
        ${
          disabled
            ? 'bg-slate-100 border-slate-200 cursor-not-allowed border-none'
            : selected
              ? 'border-cyan-400 bg-cyan-50 cursor-pointer'
              : 'border-gray-200 hover:border-cyan-400 cursor-pointer'
        }
        ${className}
      `}
    >
      <div className="flex flex-col items-start">
        <div
          className={`
          rounded-lg mb-2 w-[40px] h-[40px] flex items-center justify-center bg-white
          
        `}
        >
          <div className={`text-3xl ${disabled ? 'opacity-50' : ''}`}>{icon}</div>
        </div>
        <h3
          className={`
          mb-2 ibk-size-14-bold text-left whitespace-pre-line
          ${disabled ? 'text-slate-400' : 'text-[#004CA5]'}
        `}
        >
          {title}
        </h3>
        <p
          className={`
          ibk-size-14-regular text-left
          ${disabled ? 'text-slate-400' : 'text-gray-500'}
        `}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
