import { HttpResponse, http } from 'msw'

import { endpoints } from './endpoints'
import { mockAllAutoReports, mockAutoReportDetail, mockAutoReports, paginateReports } from './mocks'
import * as T from './types'

export const autoReportHandlers = [
  // 전체 자동 리포트 목록 조회
  http.get(endpoints.AUTO_REPORTS_LIST, async ({ request }) => {
    const url = new URL(request.url)
    const tabType = url.searchParams.get('tab_type') as 'daily' | 'weekly' | 'monthly' | null
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')

    let reports = mockAllAutoReports

    // 탭 타입으로 필터링
    if (tabType && mockAutoReports[tabType]) {
      reports = mockAutoReports[tabType]
    }

    const result = paginateReports(reports, page, limit)

    const response: T.Response<T.GetAutoReportsResponse> = {
      status: 200,
      message: 'Success',
      data: result,
      trace: null,
      path: request.url,
    }

    return HttpResponse.json(response)
  }),

  // 특정 탭의 리포트 조회
  http.get(/\/auto-reports\/(daily|weekly|monthly)/, async ({ request, params }) => {
    const tabType = params[0] as 'daily' | 'weekly' | 'monthly'
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')

    const reports = mockAutoReports[tabType] || []
    const result = paginateReports(reports, page, limit)

    const response: T.Response<T.GetAutoReportsByTabResponse> = {
      status: 200,
      message: 'Success',
      data: result,
      trace: null,
      path: request.url,
    }

    return HttpResponse.json(response)
  }),

  // 특정 리포트 상세 조회
  http.get(/\/auto-reports\/detail\/(.+)/, async ({ request, params }) => {
    const reportId = params[0] as string

    // 실제로는 reportId에 따라 다른 데이터를 반환해야 하지만,
    // 여기서는 mock 데이터를 반환
    const response: T.Response<T.GetAutoReportDetailResponse> = {
      status: 200,
      message: 'Success',
      data: {
        ...mockAutoReportDetail,
        id: reportId,
      },
      trace: null,
      path: request.url,
    }

    return HttpResponse.json(response)
  }),
]
