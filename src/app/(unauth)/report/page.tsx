'use client'

import React from 'react'

import StepComponentRenderer from '@/components/report-generation/StepComponentRenderer'
import StepNavigation from '@/components/report-generation/StepNavigation'
import { ReportBreadCrumb } from '@/components/shared/BreadCrumb'
import Header from '@/components/shared/Header'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

import { useReportCreationViewModel } from '@/hooks/main/useCreateReport'

export default function CreateReportPage() {
  const { state, getStepProps } = useReportCreationViewModel()
  const stepProps = getStepProps()

  return (
    <div className="bg-white/80 font-pretendard rounded-xl">
      <Header />

      <div className="w-full flex flex-col items-center bg-white/80">

        <div className="flex gap-4 w-full max-w-[1064px] bg-white/80">
          {/* <StepNavigation steps={stepNavigation} /> */}

          <div className="flex-1 bg-white/80">
            <div className="bg-white/80 rounded-[20px] p-4 w-full">
              {state.isLoading ? (
                <LoadingSpinner message="데이터를 불러오는 중..." />
              ) : state.isGenerating ? (
                <LoadingSpinner message="리포트를 생성하는 중..." />
              ) : (
                <StepComponentRenderer stepProps={stepProps} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
