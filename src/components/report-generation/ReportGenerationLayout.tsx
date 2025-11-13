'use client'

import React from 'react'

import { ReportBreadCrumb } from '@/components/shared/BreadCrumb'
import Header from '@/components/shared/Header'
import StepSidebar from '@/components/shared/StepSidebar'

import { REPORT_STEPS } from '@/constants/report'

interface ReportGenerationLayoutProps {
  children: React.ReactNode
  currentStep: number
}

export default function ReportGenerationLayout({
  children,
  currentStep,
}: ReportGenerationLayoutProps) {
  return (
    <div className="h-screen bg-Grayscale-B50 font-pretendard">
      <Header />

      <div className="w-full h-full px-10 py-5 flex flex-col items-center">
        <div className="mb-2 max-w-[1064px] w-full">
          <div className="flex gap-1.5 items-center">
            <h1 className="text-Pre-28-B text-Finola-Blue">리포트 생성</h1>
            <p className="text-Pre-14-R text-Grayscale-B600 mt-1">
              AI 기반 자동화 시스템으로 금융 리포트를 빠르고 정확하게 생성하세요.
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-[1064px] bg-transparent">
          <div className="w-[280px] flex-shrink-0">
            <StepSidebar steps={REPORT_STEPS} currentStep={currentStep} />
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-[20px] border-none shadow-sm p-4 max-w-[744px] w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
