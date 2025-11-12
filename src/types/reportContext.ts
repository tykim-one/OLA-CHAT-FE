export interface BasicInfo {
  title: string
  reportType: string
  period: string
  targetAudience: string
}

// 템플릿 정보 타입
export interface TemplateInfo {
  templateId: string
  templateName: string
}

// 데이터 소스 타입
export interface DataSource {
  selectedSources: Array<{
    id: string
    title: string
    description: string
    connected: boolean
  }>
  connectionSettings: Record<string, any>
}

// 콘텐츠 설정 타입
export interface ContentConfig {
  contentLength: string
  includeCharts: boolean
  includeTables: boolean
  includeSummary: boolean
  includeRecommendations: boolean
  focusAreas: string[]
  focusAreas_kor: string[]
  aiTone: string
}

// 폼 유효성 검사 상태 타입
export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

// 단계별 유효성 검사 상태
export interface StepValidations {
  basicInfo: FormValidation
  template: FormValidation
  dataSource: FormValidation
  contentConfig: FormValidation
}

// 전체 보고서 상태 타입
export interface ReportState {
  basicInfo: BasicInfo | null
  template: TemplateInfo | null
  dataSource: DataSource | null
  contentConfig: ContentConfig | null
  currentStep: number
  completedSteps: number[]
  validations: StepValidations
  isLoading: boolean
  error: string | null
  isGenerating: boolean
  generatedReportId: string | null
  lastSavedAt: string | null
}

// 액션 타입들
export type ReportAction =
  | { type: 'SET_BASIC_INFO'; payload: BasicInfo }
  | { type: 'SET_TEMPLATE'; payload: TemplateInfo }
  | { type: 'SET_DATA_SOURCE'; payload: DataSource }
  | { type: 'SET_CONTENT_CONFIG'; payload: ContentConfig }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_COMPLETED_STEPS'; payload: number[] }
  | { type: 'ADD_COMPLETED_STEP'; payload: number }
  | {
      type: 'SET_STEP_VALIDATION'
      payload: { step: keyof StepValidations; validation: FormValidation }
    }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATED_REPORT_ID'; payload: string | null }
  | { type: 'SET_LAST_SAVED_AT'; payload: string }
  | { type: 'BACKUP_STATE' }
  | { type: 'RESTORE_FROM_BACKUP' }
  | { type: 'RESET_REPORT' }
  | { type: 'LOAD_FROM_STORAGE' }
