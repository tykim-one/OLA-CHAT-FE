export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

// Report Generation Request/Response types
export type ReportGenerationRequest = {
  title: string
  date: string
  period: string
  report_type: string
  ai_tone: string
  categories: string[]
}

export type ReportGenerationResponse = {
  id: string
  message?: string
}

// Get Report Data Request/Response types
export type GetReportDataRequest = {
  id: string
}

// 단일 리포트 데이터 아이템 타입
export type ReportDataItem = {
  title: string
  category: string
  content: {
    title: string
    content: string[]
    performance_rows?: any[]
    recommended_products?: any
  }
  graph_name: string
  graph_image_path: string
  period: string
  date: string
}

// API 응답은 배열 형태
export type GetReportDataResponse = ReportDataItem[]

// Get Content Meta Request/Response types
export type GetContentMetaRequest = {
  id: string
}

export type GetContentMetaResponse = {
  data: []
  items: []
}