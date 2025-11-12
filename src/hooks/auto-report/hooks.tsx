import { useQuery } from '@tanstack/react-query'

import {
  GetAutoReportDetailQueryOptions,
  GetAutoReportsByTabQueryOptions,
  GetAutoReportsQueryOptions,
  getAutoReportDetailQueryOptions,
  getAutoReportsByTabQueryOptions,
  getAutoReportsQueryOptions,
} from './options'
import {
  GetAutoReportDetailRequestModel,
  GetAutoReportsByTabRequestModel,
  GetAutoReportsRequestModel,
} from './transforms'

// 전체 자동 리포트 목록 조회 훅
export const useGetAutoReportsQuery = (
  request: GetAutoReportsRequestModel = {},
  options?: GetAutoReportsQueryOptions,
) => {
  return useQuery(getAutoReportsQueryOptions(request, options))
}

// 특정 탭의 리포트 조회 훅
export const useGetAutoReportsByTabQuery = (
  tabType: 'daily' | 'weekly' | 'monthly',
  request: Omit<GetAutoReportsByTabRequestModel, 'tabType'> = {},
  options?: GetAutoReportsByTabQueryOptions,
) => {
  return useQuery(getAutoReportsByTabQueryOptions(tabType, request, options))
}

// 특정 리포트 상세 조회 훅
export const useGetAutoReportDetailQuery = (
  request: GetAutoReportDetailRequestModel,
  options?: GetAutoReportDetailQueryOptions,
) => {
  return useQuery(getAutoReportDetailQueryOptions(request, options))
}
