export type DailyReportTheme = 'FOREX' | 'AI' | 'DIVIDEND' | 'GENERAL'

export type DailyReportMetaResponse = {
  uuid: string
  period_type: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  title: string
  theme: DailyReportTheme
  published_at: string
}

export type ThemeNewsResponse = {
  source_url: string
  title: string
  publisher: string
  published_date: string
  theme: DailyReportTheme
  published_at: string
}[]

export type DailyLlmContentItem = {
  theme: DailyReportTheme
  prompt: string
  content: string
  source_urls: string[] | null
  reason: string | null
  model_name: string | null
  published_at: string
}

export type DailyLlmContentResponse = DailyLlmContentItem[]

export type DailyItemInfoItem = {
  symbol: string
  value: number
  unit?: string | null
  theme: DailyReportTheme | string  // API 응답에서 사용하는 필드
  item_type?: DailyReportTheme | string  // 기존 필드도 유지 (하위 호환성)
  diff: number | null
  change_value?: number | null
  published_date: string
  published_at: string
}

export type DailyItemInfoResponse = DailyItemInfoItem[]


export type DailyReportThemeGraphItem = {
  url: string
  theme: DailyReportTheme | 'KOSPI' | 'KOSDAQ'
  published_date: string
  published_at: string
  symbol: string
}

export type DailyReportThemeGraphResponse = DailyReportThemeGraphItem[]

export type DailyReportDTO = {
  id: string
  theme: DailyReportTheme
  title: string
  date: string
  news_data: ThemeNewsResponse
  table_data: DailyItemInfoResponse
  analysis_data: string
  graph_data: DailyReportThemeGraphResponse
}

export type GetDailyReportRequest = {
  id: string
}

export type GetDailyReportResponse = DailyReportDTO

export type GetDailyReportsByThemeRequest = {
  theme: DailyReportTheme
}

export type GetDailyReportsByThemeResponse = DailyReportDTO[]

