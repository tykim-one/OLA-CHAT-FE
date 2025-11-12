'use client'

import React from 'react'


import { Separator } from '@radix-ui/react-select'
import { Trash } from 'lucide-react'

interface Report {
  id: string
  title: string
  date?: string
  createdAt?: string
}

interface CreateReportViewProps {
  contentMeta: Report[]
  loading: boolean
  onNewReport: () => void
  onDeleteReport: (id: string) => void
  onReportClick: (id: string) => void
  className?: string
}

const CreateReportView: React.FC<CreateReportViewProps> = ({
  contentMeta,
  loading,
  onNewReport,
  onDeleteReport,
  onReportClick,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex flex-col justify-between gap-1.5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-base font-semibold">리포트 작성</h1>
          <span className="text-sm text-gray-600">몇 번의 클릭으로 쉽게 완성하는 리포트</span>
        </div>
        <button
          onClick={onNewReport}
          className="bg-blue-500 cursor-pointer text-white text-Pre-16-B px-6 py-3 rounded-[10px] hover:bg-Finola-Blue100 transition-colors"
        >
          리포트 생성하기
        </button>
      </div>
      <div className="text-base font-semibold mt-6">생성 기록</div>
      <Separator className="bg-slate-200 h-[1px] my-1.5" />

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-Pre-16-R text-Grayscale-B600">리포트 목록을 불러오는 중...</p>
        </div>
      )}

      {/* 리포트 목록 */}
      {!loading && contentMeta.length > 0 && (
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-scroll">
          {contentMeta
            .slice() // 원본 배열을 변경하지 않기 위해 복사
            .sort((a, b) => Number(b.id) - Number(a.id)) // id를 기준으로 역순 정렬
            .map((report) => (
              <div
                key={report.id}
                className="group bg-white rounded-[6px] shadow-sm p-4 border border-slate-100 hover:shadow-md transition-shadow cursor-pointer
                  hover:bg-slate-50 active:bg-slate-100"
                style={{
                  boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.09)',
                }}
                onClick={() => onReportClick(report.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">{report.title}</span>
                    <span className="text-sm text-gray-500">{report.date || report.createdAt}</span>
                  </div>
                  <Trash
                    className="w-6 h-6 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteReport(report.id)
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 리포트가 없을 때 표시할 빈 상태 */}
      {!loading && contentMeta.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 text-Grayscale-B200">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-Pre-20-B text-Grayscale-B900 mb-2">생성된 리포트가 없습니다</h3>
          <p className="text-Pre-14-R text-Grayscale-B600 mb-6">
            새로운 리포트를 작성하여 시작해보세요.
          </p>
          <button
            onClick={onNewReport}
            className="!bg-blue-500 text-white text-Pre-16-B px-6 py-3 rounded-2xl hover:bg-Finola-Blue100 transition-colors"
          >
            새 리포트 작성하기
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateReportView
