import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useGenerateReportMutation } from '@/hooks/data-fetching/report/hooks'

import { createReportParameters } from '@/utils/reportUtils'

import { useAuth } from '@/providers/AuthContext'
import { useReport } from '@/providers/ReportContext'

import type { BasicInfoFormData, ContentConfigData } from '@/types/report'

// import { REPORT_STEPS } from '@/constants/report'

export function useReportCreationViewModel() {
  const router = useRouter()
  const { state, actions, utils } = useReport()
  const { token } = useAuth()

  // 리포트 생성 관련 상태
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedId, setGeneratedId] = useState<string | null>(null)

  // 초기화 및 기본값 설정
  // period를 기반으로 템플릿 ID를 결정하는 함수
  const getTemplateIdByPeriod = (period: string): string => {
    switch (period) {
      case 'daily':
        return 'daily-strategy'
      case 'weekly':
        return 'weekly-strategy'
      case 'monthly':
        return 'monthly-strategy'
      case 'quarterly':
        return 'quarterly-strategy'
      case 'yearly':
        return 'yearly-strategy'
      default:
        return 'monthly-strategy' // 기본값
    }
  }

  // period를 기반으로 템플릿 이름을 결정하는 함수
  const getTemplateNameByPeriod = (period: string): string => {
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
        return 'monthly-strategy' // 기본값
    }
  }

  // Initial setup in useEffect
  React.useEffect(() => {
    actions.resetReport()
    actions.setCurrentStep(1)

    // 데이터 소스에 기본값 설정 (제거된 단계의 기본값)
    actions.setDataSource({
      selectedSources: [
        {
          id: 'sp_global',
          title: 'S&P Global DB',
          description: '글로벌 금융 데이터베이스',
          connected: true,
        },
        {
          id: 'krx',
          title: '한국거래소 (KRX)',
          description: '한국 증권거래소 데이터',
          connected: true,
        },
        {
          id: 'bok',
          title: '한국은행 경제통계',
          description: '한국은행 경제통계시스템',
          connected: true,
        },
        {
          id: 'news_research',
          title: '뉴스 & 리서치 DB',
          description: '금융 뉴스 및 리서치 데이터',
          connected: true,
        },
      ],
      connectionSettings: {},
    })
  }, [])

  // 리포트 생성 mutation
  const generateReportMutation = useGenerateReportMutation({
    onSuccess: (data) => {
      setGeneratedId(data.id)
    },
    onError: (error) => {
      console.error('리포트 생성 중 오류:', error)
      setIsGenerating(false)
      alert(
        error instanceof Error
          ? error.message
          : '리포트 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
    },
  })

  // 단계별 핸들러
  const handleBasicInfoSubmit = (data: BasicInfoFormData) => actions.handleStepSubmit(1, data)
  const handleContentSubmit = (data: ContentConfigData) => actions.handleStepSubmit(2, data)
  const handleEdit = (step: number) => actions.goToStep(step)

  // 리포트 생성 관련 핸들러
  const handleGenerate = async (reportParameters: any) => {
    if (!token) {
      alert('로그인이 필요합니다.')
      setIsGenerating(false)
      return
    }

    try {
      await generateReportMutation.mutateAsync(reportParameters)
    } catch (error) {
      // 에러 처리는 이미 mutation의 onError에서 처리됨
    }
  }

  const handleLoadingComplete = () => {
    setIsGenerating(false)

    if (generatedId) {
      router.push(`/report/completed/${generatedId}`)
    } else {
      // generatedId가 없으면 홈으로 리디렉션
      router.push('/')
    }
  }

  const handleStartGeneration = (reportData: any) => {
    // 버튼 클릭 시 즉시 로딩 상태 시작
    alert(
      '해당 리포트는 고객에게 제공이 불가하며, 상담 준비 용도로만 활용이 가능한 행내한 자료입니다.',
    )
    setIsGenerating(true)

    // 다음 렌더링 사이클에서 API 호출
    setTimeout(() => {
      handleGenerate(createReportParameters(reportData.basicInfo, reportData.contentConfig))
    }, 0)
  }

  // 현재 단계 컴포넌트에 넘길 props
  const getStepProps = () => {
    switch (state.currentStep) {
      case 1:
        return {
          component: 'BasicInfoForm',
          props: {
            onSubmit: handleBasicInfoSubmit,
            initialData: state.basicInfo || undefined,
            onPrevious: undefined, // 첫 번째 단계는 이전 단계가 없음
          },
        }
      case 2:
        return {
          component: 'ContentConfiguration',
          props: {
            onSubmit: handleContentSubmit,
            initialData: state.contentConfig || undefined,
            onPrevious: actions.goToPreviousStep,
          },
        }
      case 3:
        return {
          component: 'PreviewAndGenerate',
          props: {
            reportData: {
              basicInfo: state.basicInfo || {
                title: '',
                reportType: '',
                period: '',
                targetAudience: '',
              },
              templateId: {
                template: state.basicInfo?.period
                  ? getTemplateIdByPeriod(state.basicInfo.period)
                  : 'monthly-strategy',
              },
              dataSource: {
                sourceType: 'multiple',
                selectedSources: state.dataSource?.selectedSources || [],
              },
              contentConfig: state.contentConfig || {
                contentLength: '',
                includeCharts: false,
                includeTables: false,
                includeSummary: false,
                includeRecommendations: false,
                focusAreas: [],
                focusAreas_kor: [],
                aiTone: '',
              },
            },
            onGenerate: () =>
              handleStartGeneration({
                basicInfo: state.basicInfo,
                contentConfig: state.contentConfig,
              }),
            onGenerationComplete: handleLoadingComplete,
            onEdit: handleEdit,
            onPrevious: actions.goToPreviousStep,
            isGenerating,
            generatedId,
          },
        }
      default:
        return null
    }
  }

  // 스텝 네비게이션 데이터
  // const stepNavigation = REPORT_STEPS.map((step) => ({
  //   ...step,
  //   isActive: step.id === state.currentStep,
  //   isCompleted: utils.isStepCompleted(step.id),
  //   canAccess: utils.canAccessStep(step.id),
  //   onClick: () => {
  //     if (utils.canAccessStep(step.id) || utils.isStepCompleted(step.id)) {
  //       actions.goToStep(step.id)
  //     }
  //   },
  // }))

  return {
    state,
    actions,
    utils,
    getStepProps,
    // stepNavigation,
    // 리포트 생성 관련 상태와 핸들러들
    isGenerating,
    generatedId,
    handleStartGeneration,
    handleLoadingComplete,
  }
}
