import { ReportCategory } from '@/components/ReportBadge'

// 리포트 관련 타입 정의
export interface AutoReport {
  id?: string
  title: string
  date?: string
  category?: ReportCategory
  period_type: string
  theme: string
  published_at: string
}

// 탭 타입 정의
export type TabType = 'daily' | 'weekly' | 'monthly'

// 페이지 상태 타입 정의
export type PageState = Record<TabType, number>

// 탭 설정 타입 정의
export interface TabConfig {
  readonly key: TabType
  readonly label: string
  readonly data: AutoReport[]
}

// 리포트 데이터 구조 타입 정의
export type ReportsData = Record<TabType, AutoReport[]>

// 마켓 섹션 타입 정의
export interface MarketSection {
  title: string
  content: string[]
  image?: string
}

export type MarketSummary = Record<string, MarketSection>

export interface ReportMeta {
  title: string
  period: 'daily' | 'weekly' | 'monthly'
}

export interface Fund {
  name: string
  type: string
  investment_point: string
}

export interface ETF {
  name: string
  type: string
  investment_point: string
}

export interface RecommendedProducts {
  funds?: Fund[]
  etfs?: ETF[]
}

export interface PerformanceRow {
  name: string
  price: string
  return3m: string
  return6m: string
  return1y: string
  return2y: string
}

export interface PortfolioData {
  recommendedProducts: RecommendedProducts
  performanceRows: PerformanceRow[]
}

export interface ReportData {
  category: string
  content: {
    title: string
    content: string[]
    performance_rows?: PerformanceRow[]
    recommended_products?: RecommendedProducts
  }
  graph_image_path?: string
  title: string
  period: 'daily' | 'weekly' | 'monthly'
}

// 리포트 생성 관련 타입들
export interface BasicInfoFormData {
  title: string
  reportType: string
  period: string
  targetAudience: string
}

export interface ContentConfigData {
  contentLength: string
  includeCharts: boolean
  includeTables: boolean
  includeSummary: boolean
  includeRecommendations: boolean
  focusAreas: string[]
  focusAreas_kor: string[]
  aiTone: string
}

export interface TemplateOption {
  id: string
  title: string
  description: string
  icon: string
}

export interface DataSourceFormData {
  selectedSources: string[]
}

export interface DataSourceOption {
  id: string
  title: string
  description: string
  connected: boolean
}
