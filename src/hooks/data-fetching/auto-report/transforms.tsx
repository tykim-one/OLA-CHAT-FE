import { ReportCategory } from '@/components/shared/ReportBadge'

import * as T from '@/services/auto-report/types'

// Auto Report 도메인 모델 타입들
export type AutoReportModel = {
  id: string
  title: string
  date: string
  category: ReportCategory // UI에서 사용하는 타입
  createdAt: string
  updatedAt: string
}

export type AutoReportListModel = {
  reports: AutoReportModel[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export type AutoReportDetailModel = {
  id: string
  title: string
  date: string
  category: ReportCategory
  content: {
    summary: string
    sections: {
      title: string
      content: string
    }[]
    charts?: {
      name: string
      imagePath: string
    }[]
  }
  createdAt: string
  updatedAt: string
}

// 요청 모델 타입들
export type GetAutoReportsRequestModel = {
  tabType?: 'daily' | 'weekly' | 'monthly'
  page?: number
  limit?: number
}

export type GetAutoReportsByTabRequestModel = {
  tabType: 'daily' | 'weekly' | 'monthly'
  page?: number
  limit?: number
}

export type GetAutoReportDetailRequestModel = {
  reportId: string
}

// Model -> DTO 변환 함수들
export const transformGetAutoReportsRequestModel = (
  request: GetAutoReportsRequestModel,
): T.GetAutoReportsRequest => {
  return {
    tab_type: request.tabType,
    page: request.page,
    limit: request.limit,
  }
}

export const transformGetAutoReportsByTabRequestModel = (
  tabType: string,
  request: Omit<GetAutoReportsByTabRequestModel, 'tabType'>,
): Omit<T.GetAutoReportsByTabRequest, 'tab_type'> => {
  return {
    page: request.page,
    limit: request.limit,
  }
}

export const transformGetAutoReportDetailRequestModel = (
  request: GetAutoReportDetailRequestModel,
): string => {
  return request.reportId
}

// DTO -> Model 변환 함수들
export const transformAutoReportsResponseDTO = (
  response: T.GetAutoReportsResponse,
): AutoReportListModel => {
  return {
    reports: response.reports.map(transformAutoReportItemDTO),
    pagination: {
      currentPage: response.pagination.current_page,
      totalPages: response.pagination.total_pages,
      totalItems: response.pagination.total_items,
      itemsPerPage: response.pagination.items_per_page,
    },
  }
}

export const transformAutoReportsByTabResponseDTO = (
  response: T.GetAutoReportsByTabResponse,
): AutoReportListModel => {
  return {
    reports: response.reports.map(transformAutoReportItemDTO),
    pagination: {
      currentPage: response.pagination.current_page,
      totalPages: response.pagination.total_pages,
      totalItems: response.pagination.total_items,
      itemsPerPage: response.pagination.items_per_page,
    },
  }
}

export const transformAutoReportDetailResponseDTO = (
  response: T.GetAutoReportDetailResponse,
): AutoReportDetailModel => {
  return {
    id: response.id,
    title: response.title,
    date: response.date,
    category: response.category as ReportCategory,
    content: {
      summary: response.content.summary,
      sections: response.content.sections,
      charts: response.content.charts?.map((chart) => ({
        name: chart.name,
        imagePath: chart.image_path,
      })),
    },
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  }
}

// 개별 AutoReportItem 변환
const transformAutoReportItemDTO = (item: T.AutoReportItem): AutoReportModel => {
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    category: item.category as ReportCategory,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}
