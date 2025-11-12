export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

// Auto Report 관련 타입들
export type AutoReportCategory = 'general' | 'currency' | 'dividend' | 'ai'

export type AutoReportItem = {
  id: string
  title: string
  date: string
  category: AutoReportCategory
  created_at: string
  updated_at: string
}

// API 요청/응답 타입들
export type GetAutoReportsRequest = {
  tab_type?: 'daily' | 'weekly' | 'monthly'
  page?: number
  limit?: number
}

export type GetAutoReportsResponse = {
  reports: AutoReportItem[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

export type GetAutoReportsByTabRequest = {
  tab_type: 'daily' | 'weekly' | 'monthly'
  page?: number
  limit?: number
}

export type GetAutoReportsByTabResponse = {
  reports: AutoReportItem[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

export type GetAutoReportDetailRequest = {
  report_id: string
}

export type GetAutoReportDetailResponse = {
  id: string
  title: string
  date: string
  category: AutoReportCategory
  content: {
    summary: string
    sections: {
      title: string
      content: string
    }[]
    charts?: {
      name: string
      image_path: string
    }[]
  }
  created_at: string
  updated_at: string
}

export type AutoReportContentPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export type AutoReportContentTheme = 'FOREX' | 'AI' | 'DIVIDEND' | 'GENERAL'

export type GetAutoReportContentListRequest = {
  period_type: AutoReportContentPeriod
  theme: AutoReportContentTheme
  limit?: number
  offset?: number
}

export type AutoReportContentListItem = {
  id?: string
  uuid: string
  period_type: AutoReportContentPeriod
  title: string
  theme: AutoReportContentTheme
  created_at: string
  updated_at: string
  published_at: string
}

export type GetAutoReportContentListResponse = {
  data: AutoReportContentListItem[]
  total_count: number
  limit: number
  offset: number
}

export type MainThemeListItem = {
  theme: string
  last_updated_at: string
  title: string
}

export type GetMainThemeListResponse = MainThemeListItem[]