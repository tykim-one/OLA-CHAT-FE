'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

interface StepNavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
  nextText?: string
  previousText?: string
  nextDisabled?: boolean
  previousDisabled?: boolean
  showPrevious?: boolean
  showNext?: boolean
  nextType?: 'button' | 'submit'
  isLoading?: boolean
  loadingText?: string
  className?: string
}

export default function StepNavigationButtons({
  onPrevious = () => window.history.back(),
  onNext,
  nextText = '다음',
  previousText = '이전',
  nextDisabled = false,
  previousDisabled = false,
  showPrevious = true,
  showNext = true,
  nextType = 'button',
  isLoading = false,
  loadingText = '처리 중...',
  className = '',
}: StepNavigationButtonsProps) {
  return (
    <div className={`flex justify-start gap-4 ${className}`}>
      {showPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={previousDisabled}
          className="w-fit h-9 border-2 !border-gray-300 !text-black !rounded-[10px] hover:bg-gray-50"
        >
          {previousText}
        </Button>
      )}

      {showNext && (
        <Button
          type={nextType}
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          className="p-2.5 w-fit min-w-[133px] !bg-black text-white !rounded-[10px] h-[36px]"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {loadingText}
            </>
          ) : (
            nextText
          )}
        </Button>
      )}
    </div>
  )
}
