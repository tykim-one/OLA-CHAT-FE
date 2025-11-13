'use client'

import React, { useState } from 'react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  id: string
  label?: string
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  error?: string
  disabled?: boolean
}

export default function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  required = false,
  className = '',
  error,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (option: DropdownOption) => {
    if (onChange) {
      onChange(option.value)
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-Pre-14-R text-Grayscale-B800 mb-1 font-pretendard"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={`w-full flex justify-between items-center px-3 py-2 border ${
          error ? 'border-destructive' : 'border-Grayscale-B200'
        } rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-Finola-Blue focus:border-Finola-Blue font-pretendard text-Pre-14-R ${
          disabled ? 'bg-Grayscale-B50 text-Grayscale-B500' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-Grayscale-B900' : 'text-Grayscale-B500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-Grayscale-B500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-Grayscale-B200 ring-opacity-5 overflow-auto max-h-60 font-pretendard">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-Cyan-50 ${
                option.value === value ? 'bg-Cyan-50 text-Finola-Blue' : 'text-Grayscale-B900'
              } text-Pre-14-R`}
              onClick={() => handleSelect(option)}
            >
              <span className="block truncate">{option.label}</span>
              {option.value === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-Finola-Blue">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-Pre-12-R text-destructive font-pretendard">{error}</p>}
    </div>
  )
}
