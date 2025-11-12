import * as T from '@/services/report/types'

// Report 도메인 모델 타입들
export type ReportGenerationModel = {
  title: string
  date: string
  period: string
  report_type: string
  ai_tone: string
  categories: string[]
}

// 단일 리포트 데이터 모델
export type ReportDataItemModel = {
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

// 리포트 데이터 모델 (배열)
export type ReportDataModel = ReportDataItemModel[]

export type ReportGenerationResult = {
  id: string
  message?: string
}

export type GetReportDataRequest = {
  id: string
}

// Model -> DTO 변환 함수들
export const transformReportGenerationRequestModel = (
  request: ReportGenerationModel,
): T.ReportGenerationRequest => {
  return {
    title: request.title,
    date: request.date,
    period: request.period,
    report_type: request.report_type,
    ai_tone: request.ai_tone,
    categories: request.categories,
  }
}

export const transformGetReportDataRequestModel = (
  request: GetReportDataRequest,
): T.GetReportDataRequest => {
  return {
    id: request.id,
  }
}

// DTO -> Model 변환 함수들
export const transformReportGenerationResponseDTO = (
  response: T.ReportGenerationResponse,
): ReportGenerationResult => {
  return {
    id: response.id,
    message: response.message,
  }
}

export const transformReportDataResponseDTO = (
  response: T.GetReportDataResponse,
): ReportDataModel => {
  // API 응답이 이미 배열이므로 그대로 반환
  return response.map((item) => ({
    title: item.title,
    date: item.date,
    period: item.period,
    category: item.category,
    content: item.content,
    graph_name: item.graph_name,
    graph_image_path: item.graph_image_path,
  }))
}
