'use client'

import React from 'react'

interface StepNavigationItem {
  id: number
  title: string
  isActive: boolean
  isCompleted: boolean
  canAccess: boolean
  onClick: () => void
}

interface StepNavigationProps {
  steps: StepNavigationItem[]
}

export default function StepNavigation({ steps }: StepNavigationProps) {
  return (
    <div className="bg-Grayscale-B0 p-4 rounded-[20px] shadow-sm border border-Grayscale-B100 w-[280px] h-fit">
      <h2 className="text-Pre-16-R text-Grayscale-B900 mb-3">생성단계</h2>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
              step.isActive
                ? 'bg-[#CFE4FD] text-[#004CA5]'
                : step.isCompleted
                  ? 'text-Grayscale-B800'
                  : step.canAccess
                    ? 'text-Grayscale-B600 hover:bg-Grayscale-B25'
                    : 'text-Grayscale-B400 !cursor-not-allowed'
            }`}
            onClick={step.onClick}
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-full mr-[14px] ${
                step.isActive
                  ? 'bg-[#004CA5] text-white'
                  : step.isCompleted
                    ? 'bg-[#22CB77] text-white'
                    : step.canAccess
                      ? 'bg-[#DDDDDD] text-[#000]'
                      : 'bg-[#F5F5F5] text-[#BBBBBB]'
              }`}
            >
              {step.id}
            </div>
            <span className="text-Pre-16-B">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
