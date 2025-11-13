'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { useAutoReportWizard } from '@/hooks/useAutoReportWizard'

import { cn } from '@/lib/utils'

import { AutoReport } from '@/types/report'

import AutoReportSelection from '@/components/AutoReportSelection'
import ReportItem from '@/components/ReportItem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination'

interface AutoReportViewProps {
  className?: string
}

const ReportTabContent: React.FC<{
  reports: AutoReport[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onReportClick: (report: AutoReport) => void
  isLoading?: boolean
  error?: any
}> = ({ reports, currentPage, totalPages, onPageChange, onReportClick, isLoading, error }) => {
  if (error) {
    return (
      <div className="flex items-center justify-center h-[576px] text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[576px] text-gray-500">
        데이터를 불러오는 중...
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[576px] max-h-[576px] mb-6 overflow-y-hidden">
        <div className="space-y-1">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} onClick={() => onReportClick(report)} />
          ))}
        </div>
        {reports.length === 0 && (
          <div className="flex items-center justify-center h-[576px] text-gray-500">
            데이터가 없습니다.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center">
        {totalPages > 1 && (
          <Pagination className="justify-center">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={currentPage > 1 ? () => onPageChange(currentPage - 1) : undefined}
                  className={`
                  h-9 px-4 py-2 rounded-lg bg-white border-0 text-sm font-medium text-gray-900
                  flex items-center gap-2.5
                  ${
                    currentPage <= 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer hover:bg-gray-50'
                  }
                `}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  이전
                </PaginationPrevious>
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const showPage =
                  page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1

                if (!showPage && page === 2 && currentPage > 4) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis className="w-9 h-9 rounded-lg bg-white flex items-center justify-center" />
                    </PaginationItem>
                  )
                }

                if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis className="w-9 h-9 rounded-lg bg-white flex items-center justify-center" />
                    </PaginationItem>
                  )
                }

                if (!showPage) return null

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className={`
                      w-9 h-9 p-2 rounded-lg text-sm font-medium text-gray-900 cursor-pointer
                      flex items-center justify-center
                      ${
                        currentPage === page
                          ? 'bg-white border border-gray-200 shadow-sm'
                          : 'bg-white hover:bg-gray-50'
                      }
                    `}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={
                    currentPage < totalPages ? () => onPageChange(currentPage + 1) : undefined
                  }
                  className={`
                  h-9 px-4 py-2 rounded-lg text-sm font-medium text-gray-900
                  flex items-center gap-2.5
                  ${
                    currentPage >= totalPages
                      ? 'bg-gray-100 pointer-events-none opacity-50'
                      : 'bg-gray-100 cursor-pointer hover:bg-gray-200'
                  }
                `}
                >
                  다음
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  )
}

const AutoReportView: React.FC<AutoReportViewProps> = ({ className }) => {
  const router = useRouter()

  // useAutoReportWizard로 step 관리
  const {
    currentStep,
    selectedReportType,
    currentTab,
    reportTypeOptions,
    currentReportConfig,
    selectReportType,
    goBackToStep1,
    changeTab,
    tabData,
    onPageChange,
    showTabs,
    availableTabs,
  } = useAutoReportWizard()

  const handleReportClick = (selectedReport: AutoReport) => {
    // 리포트 카테고리에 따라 이동 경로를 분기한다.
    const { category, id } = selectedReport

    const targetPath =
      category === 'general' ? `/report/daily/summary/${id}` : `/report/daily/${id}`

    router.push(targetPath)
  }

  // Step1: 리포트 종류 선택
  if (currentStep === 1) {
    return (
      <div className={className}>
        <AutoReportSelection
          reportTypeOptions={reportTypeOptions}
          onSelectReportType={selectReportType}
        />
      </div>
    )
  }

  // Step2: 선택된 리포트의 목록 보기
  const currentTabData = tabData[currentTab]

  return (
    <div className={className}>
      {/* 뒤로가기 버튼과 제목 */}
      <div className="flex items-center gap-1.5 border-b border-gray-300 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={goBackToStep1}
            className="h-9 px-3 py-2 cursor-pointer rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* <span className="text-sm font-medium text-gray-900">이전 화면</span> */}
          </button>
          <h1 className="text-lg font-bold text-blue-500 leading-7">{currentReportConfig?.label}</h1>
        </div>
      </div>

      {/* 탭 (showTabs가 true일 때만 표시) */}
      {showTabs ? (
        <Tabs defaultValue={currentTab} className="w-full">
          {/* <TabsList className="w-full bg-transparent rounded-none border-none">
            {availableTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  'w-full cursor-pointer',
                  currentTab === tab ? '' : 'border-b border-gray-200',
                )}
                onClick={() => changeTab(tab)}
              >
                {getTabLabel(tab)}
              </TabsTrigger>
            ))}
          </TabsList> */}

          {availableTabs.map((tab) => {
            const data = tabData[tab]
            return (
              <TabsContent key={tab} value={tab}>
                <ReportTabContent
                  reports={data?.reports || []}
                  currentPage={data?.pagination.currentPage || 1}
                  totalPages={data?.pagination.totalPages || 1}
                  onPageChange={(page) => onPageChange(tab, page)}
                  onReportClick={handleReportClick}
                  isLoading={data?.isLoading || false}
                  error={data?.error}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      ) : (
        // 탭이 숨겨진 경우 (일간 시장 리포트)
        <ReportTabContent
          reports={currentTabData?.reports || []}
          currentPage={currentTabData?.pagination.currentPage || 1}
          totalPages={currentTabData?.pagination.totalPages || 1}
          onPageChange={(page) => onPageChange(currentTab, page)}
          onReportClick={handleReportClick}
          isLoading={currentTabData?.isLoading || false}
          error={currentTabData?.error}
        />
      )}
    </div>
  )
}

// 유틸리티 함수들
const getReportDescription = (reportType: string | null) => {
  switch (reportType) {
    case 'daily-market':
      return '시장 동향과 주요 이슈를 담은 일간 리포트'
    case 'forex':
      return '환율 변동과 외환 시장 분석 리포트 (일간/주간/월간)'
    case 'dividend':
      return '배당주 추천과 배당 전략 리포트 (일간/주간/월간)'
    case 'ai-theme':
      return 'AI 및 기술주 테마 분석 리포트 (일간/주간/월간)'
    default:
      return '자동 생성 리포트'
  }
}

const getTabLabel = (tab: string) => {
  switch (tab) {
    case 'daily':
      return '일간 리포트'
    case 'weekly':
      return '주간 리포트'
    case 'monthly':
      return '월간 리포트'
    default:
      return tab
  }
}

export default AutoReportView
