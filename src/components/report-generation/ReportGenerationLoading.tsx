'use client'

import React, { useEffect, useState } from 'react'

import { steps } from '@/constants/report'

interface ReportGenerationLoadingProps {
  onComplete?: () => void
  duration?: number // milliseconds
}

export default function ReportGenerationLoading({
  onComplete,
  duration = 5000,
}: ReportGenerationLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100)

        // 단계 변경 (대략적으로 1/3씩 나누어서)
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, onComplete, steps.length])

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-3xl p-12 w-full h-full mx-4 text-center shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">잠시만 기다려주세요.</h1>
        </div>

        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3">{steps[currentStep].title}</h2>

          <p className="text-sm text-gray-600 leading-relaxed">{steps[currentStep].description}</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm text-gray-500">{Math.round(progress)}% 완료</div>
      </div>
    </div>
  )
}
