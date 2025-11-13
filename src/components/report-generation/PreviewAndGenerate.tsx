'use client'

import React from 'react'

import Button from '@/components/shared/Button'
import StepNavigationButtons from '@/components/shared/StepNavigationButtons'

import {
  categoryMap,
  sourceTypeLabels,
  targetAudienceOptions,
  templateLabels,
} from '@/constants/formOptions'

import ReportGenerationLoading from './ReportGenerationLoading'

export interface PreviewAndGenerateProps {
  reportData: {
    basicInfo: {
      title: string
      reportType: string
      period: string
      targetAudience: string
    }
    templateId: {
      template: string
    }
    dataSource: {
      sourceType: string
      selectedSources: Array<{
        id: string
        title: string
        description: string
        connected: boolean
      }>
    }
    contentConfig: {
      contentLength: string
      includeCharts: boolean
      includeTables: boolean
      includeSummary: boolean
      includeRecommendations: boolean
      focusAreas: string[]
      focusAreas_kor: string[]
      aiTone: string
    }
  }
  onGenerate: () => void
  onGenerationComplete?: () => void
  onEdit: (step: number) => void
  onPrevious?: () => void
  isGenerating?: boolean
  generatedId?: string | null
}

export default function PreviewAndGenerate({
  reportData,
  onGenerate,
  onGenerationComplete,
  onEdit,
  onPrevious,
  isGenerating = false,
  generatedId,
}: PreviewAndGenerateProps) {

  const toText = (v: unknown): string => {
    if (v == null) return ''
    if (typeof v === 'string' || typeof v === 'number') return String(v)
    if (typeof v === 'object' && 'label' in (v as any)) return String((v as any).label)
    return String(v)
  }

  const getTemplateLabel = (id: string) => {
    // period를 기반으로 템플릿 이름을 결정
    const period = reportData.basicInfo?.period
    if (period) {
      switch (period) {
        case 'daily':
          return '일일 투자전략'
        case 'weekly':
          return '주간 투자전략'
        case 'monthly':
          return '월간 투자전략'
        case 'quarterly':
          return '분기 투자전략'
        case 'yearly':
          return '연간 투자전략'
        default:
          return '월간 투자전략'
      }
    }

    // fallback: 기존 templateLabels 사용
    const v = templateLabels[id as keyof typeof templateLabels] ?? id
    return toText(v)
  }

  const getSourceTypeLabel = (type: string) => {
    const v = sourceTypeLabels[type as keyof typeof sourceTypeLabels] ?? type
    return toText(v)
  }

  const getSelectedSourcesDisplay = () => {
    const list = reportData?.dataSource?.selectedSources ?? []
    if (Array.isArray(list) && list.length > 0) {
      // title이 객체일 가능성도 방어
      return list.map((s) => toText(s?.title)).join(', ')
    }
    return getSourceTypeLabel(reportData?.dataSource?.sourceType || 'multiple')
  }

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isGenerating) {
    return <ReportGenerationLoading onComplete={onGenerationComplete} duration={5000} />
  }

  // 안전성 체크
  if (!reportData) {
    return <div>데이터를 불러오는 중...</div>
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="p-3 bg-white/80 rounded-lg shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] w-full outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex flex-col justify-start items-start gap-3">
        {/* 기본 정보 카드 */}
        <div className="flex justify-between items-center">
          <h4 className="text-sm text-gray-900 font-semibold">기본 정보</h4>
        </div>
        <div className="w-full">
          <div className="space-y-3">
            <div className="flex">
              <span className="text-sm text-gray-900 font-semibold w-[120px]">리포트 제목</span>
              <span className="text-sm text-gray-900">
                {reportData.basicInfo?.title || '제목 없음'}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-900 font-semibold w-[120px]">리포트 유형</span>
              <span className="text-sm text-gray-900">
                {reportData.basicInfo?.reportType || '유형 없음'}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-900 font-semibold w-[120px]">분석 주기</span>
              <span className="text-sm text-gray-900">
                {reportData.basicInfo?.period || '주기 없음'}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-900 font-semibold w-[120px]">대상 독자</span>
              <span className="text-sm text-gray-900">
                {targetAudienceOptions.find(
                  (option) => option.value === reportData.basicInfo?.targetAudience,
                )?.label || '대상 독자 없음'}
              </span>
            </div>
          </div>
        </div>
      </div> {/* 템플릿 카드 */}
        <div className="p-3 bg-white/80 rounded-lg shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] w-full outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex flex-col justify-start items-start gap-3">
          <div className="flex">
            <span className="text-sm text-gray-900 font-semibold w-[120px]">템플릿</span>
            <span className="text-sm text-gray-900">
              {getTemplateLabel(reportData.templateId?.template || 'default')}
            </span>
        </div>
</div>
        {/* 데이터 소스 카드 */}
      <div>
        <div className="p-3 bg-white/80 rounded-lg shadow-[0px_-2px_40px_0px_rgba(223,235,255,0.15)] outline outline-1 outline-offset-[-1px] outline-gray-100 flex w-full justify-start items-start">
            <span className="text-sm text-gray-900 font-semibold w-[120px]">데이터 소스</span>
            <span className="text-sm text-gray-900">{getSelectedSourcesDisplay()}</span>
          </div>
      </div>

      <StepNavigationButtons
        nextText="리포트 생성시작"
        onNext={onGenerate}
        isLoading={isGenerating}
        loadingText="생성 중..."
        nextDisabled={isGenerating}
        onPrevious={onPrevious}
      />
    </div>
  )
}
