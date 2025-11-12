'use client'

import React, { ReactNode, createContext, useContext, useEffect, useReducer } from 'react'

import {
  BasicInfo,
  ContentConfig,
  DataSource,
  FormValidation,
  ReportAction,
  ReportState,
  StepValidations,
  TemplateInfo,
} from '@/types/reportContext'

// 초기 상태
const initialState: ReportState = {
  basicInfo: null,
  template: null,
  dataSource: null,
  contentConfig: null,
  currentStep: 1,
  completedSteps: [],
  validations: {
    basicInfo: { isValid: false, errors: {} },
    template: { isValid: false, errors: {} },
    dataSource: { isValid: false, errors: {} },
    contentConfig: { isValid: false, errors: {} },
  },
  isLoading: false,
  error: null,
  isGenerating: false,
  generatedReportId: null,
  lastSavedAt: null,
}

// Reducer 함수
function reportReducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case 'SET_BASIC_INFO':
      return { ...state, basicInfo: action.payload }
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload }
    case 'SET_DATA_SOURCE':
      return { ...state, dataSource: action.payload }
    case 'SET_CONTENT_CONFIG':
      return { ...state, contentConfig: action.payload }
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_COMPLETED_STEPS':
      return { ...state, completedSteps: action.payload }
    case 'ADD_COMPLETED_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.payload)
          ? state.completedSteps
          : [...state.completedSteps, action.payload],
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload }
    case 'SET_GENERATED_REPORT_ID':
      return { ...state, generatedReportId: action.payload }
    case 'SET_STEP_VALIDATION':
      return {
        ...state,
        validations: {
          ...state.validations,
          [action.payload.step]: action.payload.validation,
        },
      }
    case 'SET_LAST_SAVED_AT':
      return { ...state, lastSavedAt: action.payload }
    case 'BACKUP_STATE':
      // 상태를 localStorage에 백업
      backupStateToLocalStorage(state)
      return state
    case 'RESTORE_FROM_BACKUP':
      // localStorage 백업에서 상태 복원
      return { ...state, ...restoreStateFromBackup() }
    case 'RESET_REPORT':
      // localStorage 백업도 함께 클리어
      if (typeof window !== 'undefined') {
        localStorage.removeItem('reportContextBackup')
        localStorage.removeItem('reportBasicInfo')
        localStorage.removeItem('reportTemplateId')
        localStorage.removeItem('reportDataSource')
        localStorage.removeItem('reportContentConfig')
      }
      return { ...initialState }
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...loadFromLocalStorage() }
    default:
      return state
  }
}

// localStorage에서 데이터 로드 (점진적 제거 예정)
function loadFromLocalStorage(): Partial<ReportState> {
  if (typeof window === 'undefined') return {}

  try {
    const basicInfoStr = localStorage.getItem('reportBasicInfo')
    const templateIdStr = localStorage.getItem('reportTemplateId')
    const dataSourceStr = localStorage.getItem('reportDataSource')
    const contentConfigStr = localStorage.getItem('reportContentConfig')

    const loadedData = {
      basicInfo: basicInfoStr ? JSON.parse(basicInfoStr) : null,
      template: templateIdStr ? JSON.parse(templateIdStr) : null,
      dataSource: dataSourceStr ? JSON.parse(dataSourceStr) : null,
      contentConfig: contentConfigStr ? JSON.parse(contentConfigStr) : null,
    }

    // 데이터 소스 마이그레이션: string[] -> object[]
    if (loadedData.dataSource && Array.isArray(loadedData.dataSource.selectedSources)) {
      const firstItem = loadedData.dataSource.selectedSources[0]
      if (typeof firstItem === 'string') {
        // 기존 string[] 형식을 object[] 형식으로 변환
        const dataSourceOptions = [
          {
            id: 'S&P',
            title: 'S&P Global DB',
            description: '실시간 시장 데이터, 경제 지표, 기업 재무 정보',
            connected: true,
          },
          {
            id: 'krx',
            title: '한국거래소 (KRX)',
            description: '국내 주식, 채권, 파생상품 시장 데이터',
            connected: true,
          },
          {
            id: 'bok',
            title: '한국은행 경제통계',
            description: '금리, 환율, 통화량, GDP 등 주요 경제 지표',
            connected: true,
          },
          {
            id: 'news',
            title: '뉴스 & 리서치 DB',
            description: '국내외 주요 언론사 뉴스 및 증권사 리서치 자료',
            connected: true,
          },
        ]

        loadedData.dataSource.selectedSources = dataSourceOptions.filter((option) =>
          loadedData.dataSource.selectedSources.includes(option.id),
        )
      }
    }

    // 로드된 데이터를 기반으로 완료된 단계 계산 (3단계 구조로 수정)
    const completedSteps: number[] = []
    if (loadedData.basicInfo) completedSteps.push(1)
    if (loadedData.contentConfig) completedSteps.push(2)

    return {
      ...loadedData,
      completedSteps,
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return {}
  }
}

// localStorage에 데이터 저장 (백업용)
function saveToLocalStorage(key: string, data: any) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Context 상태를 localStorage에 백업
function backupStateToLocalStorage(state: ReportState) {
  if (typeof window === 'undefined') return

  try {
    const backupData = {
      basicInfo: state.basicInfo,
      template: state.template,
      dataSource: state.dataSource,
      contentConfig: state.contentConfig,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      lastSavedAt: state.lastSavedAt,
    }
    localStorage.setItem('reportContextBackup', JSON.stringify(backupData))
  } catch (error) {
    console.error('Error backing up state to localStorage:', error)
  }
}

// localStorage 백업에서 상태 복원
function restoreStateFromBackup(): Partial<ReportState> {
  if (typeof window === 'undefined') return {}

  try {
    const backupStr = localStorage.getItem('reportContextBackup')
    if (backupStr) {
      const backup = JSON.parse(backupStr)

      // 데이터 소스 마이그레이션: string[] -> object[]
      if (backup.dataSource && Array.isArray(backup.dataSource.selectedSources)) {
        const firstItem = backup.dataSource.selectedSources[0]
        if (typeof firstItem === 'string') {
          // 기존 string[] 형식을 object[] 형식으로 변환
          const dataSourceOptions = [
            {
              id: 'S&P',
              title: 'S&P Global DB',
              description: '실시간 시장 데이터, 경제 지표, 기업 재무 정보',
              connected: true,
            },
            {
              id: 'krx',
              title: '한국거래소 (KRX)',
              description: '국내 주식, 채권, 파생상품 시장 데이터',
              connected: true,
            },
            {
              id: 'bok',
              title: '한국은행 경제통계',
              description: '금리, 환율, 통화량, GDP 등 주요 경제 지표',
              connected: true,
            },
            {
              id: 'news',
              title: '뉴스 & 리서치 DB',
              description: '국내외 주요 언론사 뉴스 및 증권사 리서치 자료',
              connected: true,
            },
          ]

          backup.dataSource.selectedSources = dataSourceOptions.filter((option) =>
            backup.dataSource.selectedSources.includes(option.id),
          )
        }
      }

      return backup
    }

    // 기존 localStorage 데이터가 있다면 마이그레이션
    return loadFromLocalStorage()
  } catch (error) {
    console.error('Error restoring from backup:', error)
    return {}
  }
}

// Context 타입
interface ReportContextType {
  state: ReportState
  actions: {
    setBasicInfo: (basicInfo: BasicInfo) => void
    setTemplate: (template: TemplateInfo) => void
    setDataSource: (dataSource: DataSource) => void
    setContentConfig: (contentConfig: ContentConfig) => void
    setCurrentStep: (step: number) => void
    setCompletedSteps: (steps: number[]) => void
    addCompletedStep: (step: number) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setGenerating: (generating: boolean) => void
    setGeneratedReportId: (reportId: string | null) => void
    setStepValidation: (step: keyof StepValidations, validation: FormValidation) => void
    setLastSavedAt: (timestamp: string) => void
    resetReport: () => void
    loadFromStorage: () => void
    backupState: () => void
    restoreFromBackup: () => void
    handleStepSubmit: (step: number, data?: any) => void
    validateStep: (step: number, data?: any) => FormValidation
    saveProgress: () => void
    goToNextStep: () => void
    goToPreviousStep: () => void
    goToStep: (step: number) => void
  }
  utils: {
    isStepCompleted: (step: number) => boolean
    canProceedToStep: (step: number) => boolean
    getReportTitle: () => string
    getCompletedStepsCount: () => number
    getCurrentStepTitle: () => string
    canAccessStep: (step: number) => boolean
    getStepValidation: (step: keyof StepValidations) => FormValidation
    isFormValid: () => boolean
    getProgress: () => number
    getLastSavedTime: () => string | null
  }
}

// Context 생성
const ReportContext = createContext<ReportContextType | undefined>(undefined)

// Context Provider
export function ReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reportReducer, initialState)

  // 컴포넌트 마운트 시 백업에서 상태 복원
  useEffect(() => {
    dispatch({ type: 'RESTORE_FROM_BACKUP' })
  }, [])

  // 상태 변경 시 완료된 단계 자동 업데이트 (단계 2,3 제거로 인한 수정)
  useEffect(() => {
    const newCompletedSteps: number[] = []
    if (state.basicInfo) newCompletedSteps.push(1)
    // 템플릿과 데이터 소스는 자동으로 기본값으로 설정되므로 완료 단계에서 제외
    if (state.contentConfig) newCompletedSteps.push(2)

    // 현재 완료된 단계와 다르면 업데이트
    if (JSON.stringify(newCompletedSteps.sort()) !== JSON.stringify(state.completedSteps.sort())) {
      dispatch({ type: 'SET_COMPLETED_STEPS', payload: newCompletedSteps })
    }
  }, [state.basicInfo, state.contentConfig])

  // 상태 변경 시 자동 백업 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'BACKUP_STATE' })
    }, 1000) // 1초 후 백업

    return () => clearTimeout(timeoutId)
  }, [
    state.basicInfo,
    state.template,
    state.dataSource,
    state.contentConfig,
    state.currentStep,
    state.completedSteps,
  ])

  // 액션 생성자들
  const actions = {
    setBasicInfo: (basicInfo: BasicInfo) =>
      dispatch({ type: 'SET_BASIC_INFO', payload: basicInfo }),
    setTemplate: (template: TemplateInfo) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    setDataSource: (dataSource: DataSource) =>
      dispatch({ type: 'SET_DATA_SOURCE', payload: dataSource }),
    setContentConfig: (contentConfig: ContentConfig) =>
      dispatch({ type: 'SET_CONTENT_CONFIG', payload: contentConfig }),
    setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    setCompletedSteps: (steps: number[]) =>
      dispatch({ type: 'SET_COMPLETED_STEPS', payload: steps }),
    addCompletedStep: (step: number) => dispatch({ type: 'ADD_COMPLETED_STEP', payload: step }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setGenerating: (generating: boolean) =>
      dispatch({ type: 'SET_GENERATING', payload: generating }),
    setGeneratedReportId: (reportId: string | null) =>
      dispatch({ type: 'SET_GENERATED_REPORT_ID', payload: reportId }),
    setStepValidation: (step: keyof StepValidations, validation: FormValidation) =>
      dispatch({ type: 'SET_STEP_VALIDATION', payload: { step, validation } }),
    setLastSavedAt: (timestamp: string) =>
      dispatch({ type: 'SET_LAST_SAVED_AT', payload: timestamp }),
    resetReport: () => {
      dispatch({ type: 'RESET_REPORT' })
    },
    loadFromStorage: () => dispatch({ type: 'LOAD_FROM_STORAGE' }),
    backupState: () => dispatch({ type: 'BACKUP_STATE' }),
    restoreFromBackup: () => dispatch({ type: 'RESTORE_FROM_BACKUP' }),

    // 유효성 검사 함수
    validateStep: (step: number, data?: any): FormValidation => {
      const errors: Record<string, string> = {}

      switch (step) {
        case 1:
          if (!data?.title?.trim()) errors.title = '리포트 제목을 입력해주세요'
          if (!data?.reportType) errors.reportType = '리포트 유형을 선택해주세요'
          if (!data?.period) errors.period = '발행 주기를 선택해주세요'
          if (!data?.targetAudience) errors.targetAudience = '대상 고객을 선택해주세요'
          break
        case 2:
          if (!data) errors.template = '템플릿을 선택해주세요'
          break
        case 3:
          if (!data?.selectedSources?.length) errors.selectedSources = '데이터 소스를 선택해주세요'
          break
        case 4:
          if (!data?.aiTone) errors.aiTone = 'AI 톤을 선택해주세요'
          if (!data?.contentLength) errors.contentLength = '콘텐츠 길이를 선택해주세요'
          break
      }

      return { isValid: Object.keys(errors).length === 0, errors }
    },

    // 진행 상황 저장
    saveProgress: () => {
      actions.setLastSavedAt(new Date().toISOString())
      actions.backupState() // Context 상태를 백업
    },

    // 단계별 제출 처리 (3단계 구조로 수정)
    handleStepSubmit: (step: number, data?: any) => {
      // 유효성 검사 수행
      const validation = actions.validateStep(step, data)
      const stepKey = ['', 'basicInfo', 'contentConfig'][step] as keyof StepValidations
      actions.setStepValidation(stepKey, validation)

      // if (!validation.isValid) {
      //   actions.setError('입력 정보를 확인해주세요')
      //   return
      // }

      // 데이터 저장
      switch (step) {
        case 1:
          if (data) {
            actions.setBasicInfo(data)
            // period를 기반으로 템플릿 자동 설정
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
                  return 'monthly-strategy'
              }
            }

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
                  return '월간 투자전략'
              }
            }

            actions.setTemplate({
              templateId: getTemplateIdByPeriod(data.period),
              templateName: getTemplateNameByPeriod(data.period),
            })
          }
          break
        case 2:
          if (data) actions.setContentConfig(data)
          break
      }

      actions.addCompletedStep(step)
      actions.saveProgress()

      if (step < 3) {
        actions.setCurrentStep(step + 1)
      }
    },

    // 단계 이동 함수들
    goToNextStep: () => {
      if (state.currentStep < 3 && utils.isStepCompleted(state.currentStep)) {
        actions.setCurrentStep(state.currentStep + 1)
      }
    },
    goToPreviousStep: () => {
      if (state.currentStep > 1) {
        actions.setCurrentStep(state.currentStep - 1)
      }
    },
    goToStep: (step: number) => {
      if (utils.canAccessStep(step)) {
        actions.setCurrentStep(step)
      }
    },
  }

  // 유틸리티 함수들
  const utils = {
    isStepCompleted: (step: number): boolean => {
      return (
        state.completedSteps.includes(step) ||
        (() => {
          switch (step) {
            case 1:
              return !!state.basicInfo
            case 2:
              return !!state.contentConfig
            case 3:
              // 미리보기 단계는 이전 2단계가 모두 완료되어야 접근 가능
              return !!(state.basicInfo && state.contentConfig)
            default:
              return false
          }
        })()
      )
    },
    canProceedToStep: (step: number): boolean => {
      // 이전 단계들이 모두 완료되었는지 확인
      for (let i = 1; i < step; i++) {
        if (!utils.isStepCompleted(i)) {
          return false
        }
      }
      return true
    },
    canAccessStep: (step: number): boolean => {
      // 1단계는 항상 접근 가능
      if (step === 1) return true

      // 해당 단계가 이미 완료된 경우 접근 가능
      if (utils.isStepCompleted(step)) return true

      // 이전 단계가 완료된 경우에만 접근 가능
      return utils.isStepCompleted(step - 1)
    },
    getReportTitle: (): string => {
      return state.basicInfo?.title || '새 리포트'
    },
    getCompletedStepsCount: (): number => {
      return state.completedSteps.length
    },
    getCurrentStepTitle: (): string => {
      const stepTitles = {
        1: '리포트 기본 정보',
        2: '콘텐츠 설정',
        3: '미리보기 및 생성',
      }
      return stepTitles[state.currentStep as keyof typeof stepTitles] || '알 수 없음'
    },
    getStepValidation: (step: keyof StepValidations): FormValidation => {
      return state.validations[step] || { isValid: true, errors: {} }
    },
    isFormValid: (): boolean => {
      return Object.values(state.validations).every((v) => v.isValid)
    },
    getProgress: (): number => {
      return Math.round((state.completedSteps.length / 2) * 100)
    },
    getLastSavedTime: (): string | null => {
      return state.lastSavedAt
    },
  }

  return (
    <ReportContext.Provider value={{ state, actions, utils }}>{children}</ReportContext.Provider>
  )
}

// Context 사용을 위한 커스텀 훅
export function useReport() {
  const context = useContext(ReportContext)
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider')
  }
  return context
}

// 개별 상태 선택을 위한 커스텀 훅들
export function useReportBasicInfo() {
  const { state, actions } = useReport()
  return { basicInfo: state.basicInfo, setBasicInfo: actions.setBasicInfo }
}

export function useReportTemplate() {
  const { state, actions } = useReport()
  return { template: state.template, setTemplate: actions.setTemplate }
}

export function useReportDataSource() {
  const { state, actions } = useReport()
  return { dataSource: state.dataSource, setDataSource: actions.setDataSource }
}

export function useReportContentConfig() {
  const { state, actions } = useReport()
  return { contentConfig: state.contentConfig, setContentConfig: actions.setContentConfig }
}
