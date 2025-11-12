import { UseQueryOptions } from '@tanstack/react-query'

import * as api from '@/services/auto-report/api'

import { keys } from './keys'
import {
  AutoReportDetailModel,
  AutoReportListModel,
  GetAutoReportDetailRequestModel,
  GetAutoReportsByTabRequestModel,
  GetAutoReportsRequestModel,
  transformAutoReportDetailResponseDTO,
  transformAutoReportsByTabResponseDTO,
  transformAutoReportsResponseDTO,
  transformGetAutoReportDetailRequestModel,
  transformGetAutoReportsByTabRequestModel,
  transformGetAutoReportsRequestModel,
} from './transforms'

// 옵션 타입 정의 - 도메인 모델 타입 사용
export type GetAutoReportsQueryOptions = Partial<UseQueryOptions<AutoReportListModel>>
export type GetAutoReportsByTabQueryOptions = Partial<UseQueryOptions<AutoReportListModel>>
export type GetAutoReportDetailQueryOptions = Partial<UseQueryOptions<AutoReportDetailModel>>
export type GetAutoReportContentListQueryOptions = Partial<UseQueryOptions<AutoReportListModel>>

// 전체 자동 리포트 목록 조회
export const getAutoReportsQueryOptions = (
  request: GetAutoReportsRequestModel = {},
  options?: GetAutoReportsQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_AUTO_REPORTS(request.tabType, request.page, request.limit),
    queryFn: async () => {
      // NextJS 렌더링 관련 오류 방지
      await Promise.resolve()

      return api
        .getAutoReports(transformGetAutoReportsRequestModel(request))
        .then((response) => transformAutoReportsResponseDTO(response))
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  }
}

// 특정 탭의 리포트 조회
export const getAutoReportsByTabQueryOptions = (
  tabType: 'daily' | 'weekly' | 'monthly',
  request: Omit<GetAutoReportsByTabRequestModel, 'tabType'> = {},
  options?: GetAutoReportsByTabQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_AUTO_REPORTS_BY_TAB(tabType, request.page, request.limit),
    queryFn: async () => {
      // NextJS 렌더링 관련 오류 방지
      await Promise.resolve()

      return api
        .getAutoReportsByTab(tabType, transformGetAutoReportsByTabRequestModel(tabType, request))
        .then((response) => transformAutoReportsByTabResponseDTO(response))
    },
    enabled: !!tabType, // tabType이 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  }
}

// 특정 리포트 상세 조회
export const getAutoReportDetailQueryOptions = (
  request: GetAutoReportDetailRequestModel,
  options?: GetAutoReportDetailQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_AUTO_REPORT_DETAIL(request.reportId),
    queryFn: async () => {
      // NextJS 렌더링 관련 오류 방지
      await Promise.resolve()

      return api
        .getAutoReportDetail(transformGetAutoReportDetailRequestModel(request))
        .then((response) => transformAutoReportDetailResponseDTO(response))
    },
    enabled: !!request.reportId, // reportId가 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  }
}

export const getAutoReportContentListQueryOptions = (
  request: GetAutoReportsRequestModel,
  options?: GetAutoReportContentListQueryOptions,
) => {
  return {
    ...options,
    queryKey: keys.GET_AUTO_REPORT_CONTENT_LIST(request.tabType, request.page, request.limit),
    queryFn: async () => {
      await Promise.resolve()

      return api
        .getAutoReportContentList({
          period_type: (request.tabType ?? 'daily').toUpperCase() as any,
          theme: 'GENERAL',
          limit: request.limit,
          offset: request.page ? (request.page - 1) * (request.limit ?? 12) : 0,
        })
        .then((response) => transformAutoReportsResponseDTO({
          reports: response.data.map((item, index) => ({
            id: `${item.period_type}-${item.theme}-${index}`,
            title: item.title,
            date: item.created_at,
            category: item.theme.toLowerCase() as any,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })),
          pagination: {
            current_page: request.page ?? 1,
            total_pages: 1,
            total_items: response.total_count,
            items_per_page: request.limit ?? 12,
          },
        }))
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }
}
