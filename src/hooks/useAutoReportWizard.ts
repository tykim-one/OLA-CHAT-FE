import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { getAutoReportContentList, getMainThemeList } from '@/services/auto-report/api'
import type {
  AutoReportContentListItem,
  AutoReportContentTheme,
  AutoReportContentPeriod,
  MainThemeListItem,
} from '@/services/auto-report/types'
import type { AutoReport, TabType } from '@/types/report'
import { usePagination } from '@/hooks/usePagination'

const ITEMS_PER_PAGE = 12

const PERIOD_MAP: Record<TabType, AutoReportContentPeriod> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  monthly: 'MONTHLY',
}

// 리포트 타입 정의
export type ReportType = 'daily-market' | 'forex' | 'dividend' | 'ai-theme'

// 리포트 종류별 설정
const REPORT_TYPE_CONFIG = {
  'daily-market': {
    theme: 'GENERAL' as AutoReportContentTheme,
    label: '일간 시장 리포트',
    availableTabs: ['daily'] as TabType[],
    showTabs: false, // UI에서 탭 숨김
  },
  'forex': {
    theme: 'FOREX' as AutoReportContentTheme,
    label: '환율 리포트',
    availableTabs: ['daily', 'weekly', 'monthly'] as TabType[],
    showTabs: true,
  },
  'dividend': {
    theme: 'DIVIDEND' as AutoReportContentTheme,
    label: '배당 전략 리포트',
    availableTabs: ['daily', 'weekly', 'monthly'] as TabType[],
    showTabs: true,
  },
  'ai-theme': {
    theme: 'AI' as AutoReportContentTheme,
    label: 'AI 테마 리포트',
    availableTabs: ['daily', 'weekly', 'monthly'] as TabType[],
    showTabs: true,
  },
} as const

interface TabDataItem {
  reports: AutoReport[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  isLoading: boolean
  error: string | null
}

interface ReportTypeOption {
  value: ReportType
  label: string
  lastUpdatedAt: string
}

interface AutoReportWizardState {
  currentStep: 1 | 2
  selectedReportType: ReportType | null
  currentTab: TabType
}

export const useAutoReportWizard = () => {
  // Wizard 상태 관리
  const [wizardState, setWizardState] = useState<AutoReportWizardState>({
    currentStep: 1,
    selectedReportType: null,
    currentTab: 'daily', // 기본값
  })

  // 현재 선택된 리포트 타입의 설정
  const currentReportConfig = wizardState.selectedReportType
    ? REPORT_TYPE_CONFIG[wizardState.selectedReportType]
    : null

  // 현재 리포트 타입의 사용 가능한 탭들로 페이지네이션 초기화
  const availableTabs = currentReportConfig?.availableTabs ?? ['daily', 'weekly', 'monthly']
  const initialPages = availableTabs.reduce((acc, tab) => {
    acc[tab] = 1
    return acc
  }, {} as Record<TabType, number>)

  const { currentPages, handlePageChange } = usePagination<{ id: string }>(
    initialPages,
    ITEMS_PER_PAGE,
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tabReports, setTabReports] = useState<Record<TabType, AutoReportContentListItem[]>>({
    daily: [],
    weekly: [],
    monthly: [],
  })
  const [tabPagination, setTabPagination] = useState<Record<TabType, { total_count: number; limit: number; offset: number }>>({
    daily: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
    weekly: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
    monthly: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
  })

  // 리포트 타입 옵션 상태
  const [reportTypeOptions, setReportTypeOptions] = useState<ReportTypeOption[]>([])
  const [isLoadingReportTypes, setIsLoadingReportTypes] = useState(false)
  const [reportTypesError, setReportTypesError] = useState<string | null>(null)

  // 테마를 리포트 타입으로 매핑하는 함수
  const mapThemeToReportType = (theme: string): ReportType | null => {
    switch (theme.toUpperCase()) {
      case 'AI':
        return 'ai-theme'
      case 'DIVIDEND':
        return 'dividend'
      case 'FOREX':
        return 'forex'
      case 'GENERAL':
        return 'daily-market'
      default:
        return null
    }
  }

  // 리포트 타입 옵션 페칭
  const fetchReportTypeOptions = useCallback(async () => {
    setIsLoadingReportTypes(true)
    setReportTypesError(null)

    try {
      const themeList = await getMainThemeList()
      
      const options: ReportTypeOption[] = themeList
        .map((item: MainThemeListItem) => {
          const reportType = mapThemeToReportType(item.theme)
          if (!reportType) return null

          return {
            value: reportType,
            label: item.title,
            lastUpdatedAt: dayjs(item.last_updated_at).format('YYYY.MM.DD'),
          }
        })
        .filter((option): option is ReportTypeOption => option !== null)

      // 정렬 순서: general, forex, dividend, ai
      const sortOrder: ReportType[] = ['daily-market', 'forex', 'dividend', 'ai-theme']
      const sortedOptions = options.sort((a, b) => {
        const indexA = sortOrder.indexOf(a.value)
        const indexB = sortOrder.indexOf(b.value)
        return indexA - indexB
      })

      setReportTypeOptions(sortedOptions)
    } catch (fetchError) {
      console.error('리포트 타입 목록을 불러오는 중 오류가 발생했습니다.', fetchError)
      setReportTypesError('리포트 타입 데이터를 불러오지 못했습니다.')
    } finally {
      setIsLoadingReportTypes(false)
    }
  }, [])

  // Step1: 리포트 종류 선택
  const selectReportType = useCallback((reportType: ReportType) => {
    setWizardState({
      currentStep: 2,
      selectedReportType: reportType,
      currentTab: REPORT_TYPE_CONFIG[reportType].availableTabs[0], // 첫 번째 탭을 기본값으로
    })
  }, [])

  // Step2에서 Step1으로 돌아가기
  const goBackToStep1 = useCallback(() => {
    setWizardState({
      currentStep: 1,
      selectedReportType: null,
      currentTab: 'daily',
    })
    // 데이터 초기화
    setTabReports({
      daily: [],
      weekly: [],
      monthly: [],
    })
    setTabPagination({
      daily: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
      weekly: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
      monthly: { total_count: 0, limit: ITEMS_PER_PAGE, offset: 0 },
    })
    setError(null)
  }, [])

  // 탭 변경
  const changeTab = useCallback((tab: TabType) => {
    if (!currentReportConfig?.availableTabs.includes(tab)) {
      return
    }
    setWizardState(prev => ({
      ...prev,
      currentTab: tab,
    }))
  }, [currentReportConfig])

  // 리포트 데이터 페칭
  const fetchReports = useCallback(async () => {
    if (!currentReportConfig || wizardState.currentStep !== 2) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const entries = await Promise.all(
        currentReportConfig.availableTabs.map(async (tab) => {
          const page = currentPages[tab] || 1
          const offset = (page - 1) * ITEMS_PER_PAGE

          const response = await getAutoReportContentList({
            period_type: PERIOD_MAP[tab],
            theme: currentReportConfig.theme,
            limit: ITEMS_PER_PAGE,
            offset,
          })

          return [tab, response] as const
        }),
      )

      const nextReportsData = entries.reduce((acc, [tab, response]) => {
        acc[tab] = response.data
        return acc
      }, {} as Record<TabType, AutoReportContentListItem[]>)

      const nextPaginationData = entries.reduce((acc, [tab, response]) => {
        acc[tab] = {
          total_count: response.total_count,
          limit: response.limit,
          offset: response.offset,
        }
        return acc
      }, {} as Record<TabType, { total_count: number; limit: number; offset: number }>)

      setTabReports(nextReportsData)
      setTabPagination(nextPaginationData)
    } catch (fetchError) {
      console.error('자동 리포트 목록을 불러오는 중 오류가 발생했습니다.', fetchError)
      setError('자동 리포트 데이터를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [currentReportConfig, wizardState.currentStep, currentPages])

  // 컴포넌트 마운트 시 리포트 타입 옵션 페칭
  useEffect(() => {
    fetchReportTypeOptions()
  }, [fetchReportTypeOptions])

  // Step2 진입 시 또는 페이지 변경 시 데이터 페칭
  useEffect(() => {
    if (wizardState.currentStep === 2 && currentReportConfig) {
      fetchReports()
    }
  }, [fetchReports, wizardState.currentStep, currentReportConfig])

  // 탭 데이터 가공
  const tabData = useMemo(() => {
    if (!currentReportConfig) {
      return {} as Record<TabType, TabDataItem>
    }

    return currentReportConfig.availableTabs.reduce((acc, tab) => {
      const items = tabReports[tab] || []
      const pagination = tabPagination[tab]
      const currentPage = currentPages[tab] || 1
      
      // API 응답의 페이지네이션 데이터 사용
      const totalPages = Math.ceil(pagination.total_count / pagination.limit)
      const totalItems = pagination.total_count

      acc[tab] = {
        reports: items.map((item) => ({
          id: item.uuid,
          title: item.title,
          period_type: item.period_type,
          theme: item.theme,
          date: formatDate(item.created_at),
          category: mapThemeToCategory(item.theme),
          published_at: item.published_at,
        })),
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
        },
        isLoading,
        error,
      }

      return acc
    }, {} as Record<TabType, TabDataItem>)
  }, [currentReportConfig, tabReports, tabPagination, currentPages, isLoading, error])

  // 페이지 변경
  const onPageChange = useCallback((tabType: TabType, page: number) => {
    handlePageChange(tabType, page)
  }, [handlePageChange])

  return {
    // Wizard 상태
    currentStep: wizardState.currentStep,
    selectedReportType: wizardState.selectedReportType,
    currentTab: wizardState.currentTab,

    // 리포트 타입 설정
    reportTypeOptions,
    isLoadingReportTypes,
    reportTypesError,
    currentReportConfig,

    // Step1 액션
    selectReportType,

    // Step2 액션
    goBackToStep1,
    changeTab,

    // 데이터 관련
    tabData,
    currentPages,
    isLoading,
    error,
    onPageChange,

    // UI 헬퍼
    showTabs: currentReportConfig?.showTabs ?? false,
    availableTabs: currentReportConfig?.availableTabs ?? [],
  }
}

// 유틸리티 함수들

const mapThemeToCategory = (theme: AutoReportContentTheme): AutoReport['category'] => {
  switch (theme) {
    case 'FOREX':
      return 'currency'
    case 'AI':
      return 'ai'
    case 'DIVIDEND':
      return 'dividend'
    default:
      return 'general'
  }
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return isoString
  }

  return date.toLocaleDateString('ko-KR')
}