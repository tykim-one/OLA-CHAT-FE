'use client'

import React from 'react'

import type { ReportType } from '@/hooks/useAutoReportWizard'
import { cn } from '@/lib/utils'

interface AutoReportSelectionProps {
  className?: string
  reportTypeOptions: Array<{ value: ReportType; label: string; lastUpdatedAt: string }>
  onSelectReportType: (reportType: ReportType) => void
}

const ReportTypeCard: React.FC<{
  reportType: { value: ReportType; label: string; lastUpdatedAt: string }
  onClick: () => void
}> = ({ reportType, onClick }) => {
  const getCardIcon = (type: ReportType) => {
    switch (type) {
      case 'daily-market':
        return (
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 2V4M12.5 20V22M5.42993 4.92993L6.83993 6.33993M18.1602 17.6599L19.5702 19.0699M2.5 12H4.5M20.5 12H22.5M6.83993 17.6599L5.42993 19.0699M19.5702 4.92993L18.1602 6.33993M16.5 12C16.5 14.2091 14.7091 16 12.5 16C10.2909 16 8.5 14.2091 8.5 12C8.5 9.79086 10.2909 8 12.5 8C14.7091 8 16.5 9.79086 16.5 12Z" stroke="#EC4899" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'forex':
        return (
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 2V22M17.5 5H10C9.07174 5 8.1815 5.36875 7.52513 6.02513C6.86875 6.6815 6.5 7.57174 6.5 8.5C6.5 9.42826 6.86875 10.3185 7.52513 10.9749C8.1815 11.6313 9.07174 12 10 12H15C15.9283 12 16.8185 12.3687 17.4749 13.0251C18.1313 13.6815 18.5 14.5717 18.5 15.5C18.5 16.4283 18.1313 17.3185 17.4749 17.9749C16.8185 18.6313 15.9283 19 15 19H6.5" stroke="#14B8A6" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'dividend':
        return (
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 15H13.5C14.0304 15 14.5391 14.7893 14.9142 14.4142C15.2893 14.0391 15.5 13.5304 15.5 13C15.5 12.4696 15.2893 11.9609 14.9142 11.5858C14.5391 11.2107 14.0304 11 13.5 11H10.5C9.9 11 9.4 11.2 9.1 11.6L3.5 17M7.5 21L9.1 19.6C9.4 19.2 9.9 19 10.5 19H14.5C15.6 19 16.6 18.6 17.3 17.8L21.9 13.4C22.2859 13.0354 22.5111 12.5323 22.5261 12.0016C22.5411 11.4709 22.3447 10.9559 21.98 10.57C21.6153 10.1841 21.1123 9.95892 20.5816 9.94392C20.0508 9.92891 19.5359 10.1254 19.15 10.49L14.95 14.39M2.5 16L8.5 22M19.4001 9.0001C19.4001 10.6017 18.1017 11.9001 16.5001 11.9001C14.8985 11.9001 13.6001 10.6017 13.6001 9.0001C13.6001 7.39847 14.8985 6.1001 16.5001 6.1001C18.1017 6.1001 19.4001 7.39847 19.4001 9.0001ZM9.5 5C9.5 6.65685 8.15685 8 6.5 8C4.84315 8 3.5 6.65685 3.5 5C3.5 3.34315 4.84315 2 6.5 2C8.15685 2 9.5 3.34315 9.5 5Z" stroke="#8B5CF6" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'ai-theme':
        return (
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.50381 5.12505C6.48596 4.72548 6.5482 4.32637 6.68686 3.9512C6.82552 3.57604 7.03779 3.23238 7.31121 2.94045C7.58462 2.64853 7.91365 2.41422 8.27894 2.25132C8.64424 2.08841 9.03842 2.0002 9.4383 1.99186C9.83819 1.98353 10.2357 2.05524 10.6075 2.20278C10.9792 2.35032 11.3177 2.57072 11.6031 2.851C11.8884 3.13128 12.1148 3.46579 12.269 3.83485C12.4232 4.20391 12.502 4.60008 12.5008 5.00005V18M6.50381 5.12505C5.91601 5.27619 5.37031 5.5591 4.90804 5.95236C4.44577 6.34562 4.07905 6.83892 3.83565 7.3949C3.59225 7.95087 3.47857 8.55494 3.5032 9.16136C3.52782 9.76778 3.69013 10.3606 3.97781 10.8951M6.50381 5.12505C6.52358 5.60878 6.65999 6.0805 6.90166 6.5M3.97781 10.8951C3.47199 11.306 3.07423 11.8343 2.81915 12.434C2.56406 13.0337 2.45936 13.6866 2.51417 14.336C2.56898 14.9854 2.78162 15.6116 3.13361 16.1601C3.4856 16.7085 3.96627 17.1627 4.53381 17.4831M3.97781 10.8951C4.16075 10.7461 4.35649 10.6145 4.56278 10.5M4.53381 17.4831C4.46372 18.0253 4.50555 18.5761 4.65669 19.1016C4.80784 19.627 5.0651 20.1159 5.41259 20.538C5.76008 20.9601 6.19042 21.3065 6.67703 21.5558C7.16364 21.8051 7.69618 21.952 8.24178 21.9874C8.78738 22.0228 9.33445 21.946 9.84919 21.7617C10.3639 21.5774 10.8354 21.2895 11.2346 20.9158C11.6337 20.5421 11.952 20.0906 12.1698 19.5891C12.3876 19.0876 12.5002 18.5468 12.5008 18M4.53381 17.4831C5.13407 17.8216 5.81152 18.0002 6.50069 17.9999M12.5008 18L18.5007 18C19.0312 18 19.5399 18.2107 19.9149 18.5858C20.29 18.9609 20.5007 19.4696 20.5007 20V21M9.50073 13C10.3403 12.7047 11.0734 12.167 11.6074 11.455C12.1414 10.743 12.4523 9.88867 12.5007 9M12.5007 13H16.5007M12.5007 8H20.5007M16.5007 8V5C16.5007 4.46957 16.7114 3.96086 17.0865 3.58579C17.4616 3.21071 17.9703 3 18.5007 3M17.0007 13C17.0007 13.2761 16.7769 13.5 16.5007 13.5C16.2246 13.5 16.0007 13.2761 16.0007 13C16.0007 12.7239 16.2246 12.5 16.5007 12.5C16.7769 12.5 17.0007 12.7239 17.0007 13ZM19.0007 3C19.0007 3.27614 18.7769 3.5 18.5007 3.5C18.2246 3.5 18.0007 3.27614 18.0007 3C18.0007 2.72386 18.2246 2.5 18.5007 2.5C18.7769 2.5 19.0007 2.72386 19.0007 3ZM21.0007 21C21.0007 21.2761 20.7769 21.5 20.5007 21.5C20.2246 21.5 20.0007 21.2761 20.0007 21C20.0007 20.7239 20.2246 20.5 20.5007 20.5C20.7769 20.5 21.0007 20.7239 21.0007 21ZM21.0007 8C21.0007 8.27614 20.7769 8.5 20.5007 8.5C20.2246 8.5 20.0007 8.27614 20.0007 8C20.0007 7.72386 20.2246 7.5 20.5007 7.5C20.7769 7.5 21.0007 7.72386 21.0007 8Z" stroke="#3B82F6" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
    }
  }

  const getCardTheme = (type: ReportType) => {
    switch (type) {
      case 'daily-market':
        return {
          badgeBg: 'bg-pink-50',
          border: 'border-gray-200 hover:border-pink-300',
          hover: 'hover:bg-pink-50/50'
        }
      case 'forex':
        return {
          badgeBg: 'bg-teal-50',
          border: 'border-gray-200 hover:border-teal-300',
          hover: 'hover:bg-teal-50/50'
        }
      case 'dividend':
        return {
          badgeBg: 'bg-violet-50',
          border: 'border-gray-200 hover:border-violet-300',
          hover: 'hover:bg-violet-50/50'
        }
      case 'ai-theme':
        return {
          badgeBg: 'bg-blue-50',
          border: 'border-gray-200 hover:border-blue-300',
          hover: 'hover:bg-blue-50/50'
        }
      default:
        return {
          badgeBg: 'bg-gray-50',
          border: 'border-gray-200 hover:border-gray-300',
          hover: 'hover:bg-gray-50/50'
        }
    }
  }

  const theme = getCardTheme(reportType.value)

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border ${theme.border} ${theme.hover} transition-all duration-200 hover:shadow-md bg-white`}
      style={{ width: '239px', height: '200px' }}
    >
      <div className="flex flex-col items-center justify-center h-full px-3 py-8 space-y-2">
        {/* Icon Badge */}
        <div className={`${theme.badgeBg} rounded-lg p-4 flex items-center justify-center`} style={{ width: '56px', height: '56px' }}>
          {getCardIcon(reportType.value)}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-black text-center leading-8">
          {reportType.label}
        </h3>

        {/* Last Updated */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-sm text-slate-500">마지막 생성:</span>
          <span className="text-sm text-slate-800">
            {reportType.lastUpdatedAt}
          </span>
        </div>
      </div>
    </div>
  )
}

const AutoReportSelection: React.FC<AutoReportSelectionProps> = ({
  className,
  reportTypeOptions,
  onSelectReportType,
}) => {
  return (
    <div className={cn(className, 'min-h-[200px]')}>
      {/* 제목 및 설명 */}
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-blue-500 text-base font-bold leading-6">
          자동 리포트 보기
        </span>
      </div>

      {/* 리포트 종류 선택 카드들 */}
      <div className="flex gap-3 flex-wrap">
        {reportTypeOptions.map((reportType) => (
          <ReportTypeCard
            key={reportType.value}
            reportType={reportType}
            onClick={() => onSelectReportType(reportType.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default AutoReportSelection