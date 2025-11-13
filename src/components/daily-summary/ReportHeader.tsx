'use client'

import Image from 'next/image'
import React from 'react'

import { Bot, Check } from 'lucide-react'

import { AiReportInfo } from '@/types/dailySummary'

const getGeneratedAtDisplay = (timestamp: string) => {
  if (!timestamp) {
    return '07:20 KST'
  }

  const [datePart] = timestamp.split(' ')

  if (!datePart) {
    return '07:20 KST'
  }

  return `${datePart} 07:20 KST`
}

interface ReportHeaderProps {
  title: string
  aiReportInfo: AiReportInfo
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ title, aiReportInfo }) => {
  const generatedAtDisplay = React.useMemo(() => {
    return getGeneratedAtDisplay(aiReportInfo.generatedAt)
  }, [aiReportInfo.generatedAt])

  return (
    <div className="flex flex-col gap-6">
      {/* 제목 섹션 */}
      <div className="relative w-full h-24 px-5 py-3 bg-[#EFF6FF] flex flex-col items-center justify-center gap-1.5">
        <div className="w-[87px] h-[30px]">
          <Image src="/daily/header.png" alt="IBK" width={87} height={30} />
        </div>
        <h1 className="text-[30px] font-bold text-[#004CA5] text-center leading-9">{title}</h1>

        {/* 우측 상단 배지 */}
        <div className="absolute top-[30px] right-5 px-3 py-2 bg-red-500 rounded shadow-lg">
          <span className="text-sm font-medium text-white text-center leading-5">행 내 한</span>
        </div>
      </div>

      {/* AI Report 정보 */}
      <div className="flex flex-col items-center gap-2 px-5">
        {/* Midheader */}
        <div className="flex items-center justify-start gap-2.5 w-full">
          <Bot className="w-8 h-8 text-blue-500" strokeWidth={1.33} />
          <h2 className="text-2xl font-bold text-black">Daily AI Report</h2>
        </div>

        {/* AI Info Card */}
        <div className="w-full min-h-[60px] p-4 bg-white border border-slate-300 rounded-xl shadow-sm">
          {/* AI 정보 */}
          <div className="flex items-center gap-2.5 min-h-7 flex-nowrap">
            <span className="text-base font-medium text-[#64748B] leading-6 whitespace-nowrap">
              자동 생성 시각 · {generatedAtDisplay}
            </span>

            {/* 검증 출처 배지 */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#155E75] rounded-xl h-7 flex-shrink-0">
              <Check className="w-[22px] h-[22px] text-white" strokeWidth={1.33} />
              <span className="text-base font-bold text-white leading-6 whitespace-nowrap">
                검증 출처 63개
              </span>
            </div>

            {/* 생성 모델 배지 */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#6B21A8] rounded-xl h-7 flex-shrink-0">
              <Check className="w-[22px] h-[22px] text-white" strokeWidth={1.33} />
              <span className="text-base font-bold text-white leading-6 whitespace-nowrap">
                생성 모델: GPT 5.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportHeader
