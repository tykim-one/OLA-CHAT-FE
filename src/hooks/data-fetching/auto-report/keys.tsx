export const keys = {
  // 전체 자동 리포트 목록 조회
  GET_AUTO_REPORTS: (tabType?: string, page?: number, limit?: number) =>
    ['getAutoReports', tabType, page, limit].filter(Boolean),

  // 특정 탭의 리포트 조회
  GET_AUTO_REPORTS_BY_TAB: (tabType: string, page?: number, limit?: number) =>
    ['getAutoReportsByTab', tabType, page, limit].filter(Boolean),

  // 특정 리포트 상세 조회
  GET_AUTO_REPORT_DETAIL: (reportId: string) => ['getAutoReportDetail', reportId],

  // 자동 리포트 콘텐츠 목록 조회
  GET_AUTO_REPORT_CONTENT_LIST: (tabType?: string, page?: number, limit?: number) =>
    ['getAutoReportContentList', tabType, page, limit].filter(Boolean),
} as const

export type AutoReportKeys = typeof keys
