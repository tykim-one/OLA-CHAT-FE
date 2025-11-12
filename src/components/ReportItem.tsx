'use client'

import React from 'react'

import { AutoReport } from '@/types/report'

import ReportBadge from './ReportBadge'

interface ReportItemProps {
  report: AutoReport
  onClick: (report: AutoReport) => void
}

const ReportItem: React.FC<ReportItemProps> = ({ report, onClick }) => {
  const handleClick = () => {
    onClick(report)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    onClick(report)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${report.title} 리포트 상세 보기`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between w-full p-3 bg-white border-b border-gray-100 hover:shadow-md transition-shadow cursor-pointer group h-[48px]"
    >
      <div className="flex items-center gap-2">
        {report.category && <ReportBadge category={report.category} />}
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold">{report.title}</span>
          <span className="text-slate-500 text-sm leading-5">{report.published_at}</span>
        </div>
      </div>
    </div>
  )
}

export default ReportItem
