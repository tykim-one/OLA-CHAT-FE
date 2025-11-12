import { api } from '@/lib/http'

import { endpoints } from './endpoints'
import * as T from './types'

// 전체 자동 생성 리포트 목록 조회
export const getAutoReports = async (args: T.GetAutoReportsRequest = {}) => {
  const params = new URLSearchParams()
  if (args.tab_type) params.append('tab_type', args.tab_type)
  if (args.page) params.append('page', args.page.toString())
  if (args.limit) params.append('limit', args.limit.toString())

  const query = params.toString() ? `?${params.toString()}` : ''

  return api
    .get<T.GetAutoReportsResponse>(`${endpoints.AUTO_REPORTS_LIST}${query}`)
    .then((d) => d.data)
}

// 특정 탭의 리포트 조회
export const getAutoReportsByTab = async (
  tabType: string,
  args: Omit<T.GetAutoReportsByTabRequest, 'tab_type'> = {},
) => {
  const params = new URLSearchParams()
  if (args.page) params.append('page', args.page.toString())
  if (args.limit) params.append('limit', args.limit.toString())

  const query = params.toString() ? `?${params.toString()}` : ''

  return api
    .get<T.GetAutoReportsByTabResponse>(`${endpoints.AUTO_REPORTS_BY_TAB(tabType)}${query}`)
    .then((d) => d.data)
}

// 특정 리포트 상세 조회
export const getAutoReportDetail = async (reportId: string) => {
  return api
    .get<T.GetAutoReportDetailResponse>(endpoints.AUTO_REPORT_DETAIL(reportId))
    .then((d) => d.data)
}

export const getAutoReportContentList = async (
  args: T.GetAutoReportContentListRequest,
): Promise<T.GetAutoReportContentListResponse> => {
  const params = new URLSearchParams()

  params.append('period_type', args.period_type)
  params.append('theme', args.theme)
  // params.append('theme', args.theme)
  params.append('limit', (args.limit ?? 50).toString())
  params.append('offset', (args.offset ?? 0).toString())

  const query = `?${params.toString()}`

  return api
    .get<T.GetAutoReportContentListResponse>(`${endpoints.AUTO_REPORT_CONTENT_LIST}${query}`)
    .then((d) => {
      return d.data
    })
}

// 메인 테마 목록 조회
export const getMainThemeList = async (): Promise<T.GetMainThemeListResponse> => {
  return api
    .get<T.GetMainThemeListResponse>(endpoints.MAIN_THEME_LIST)
    .then((d) => d.data)
}