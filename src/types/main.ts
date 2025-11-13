/**
 * 리포트 아이템 타입
 */
export interface ReportItem {
  id: string
  title: string
  createdAt: string
  date?: string // API 응답에서 date 속성이 있을 수 있음
  status: 'completed' | 'pending' | 'draft'
}

/**
 * Main 페이지 ViewModel의 인터페이스
 */
export interface MainPageViewModel {
  // 상태
  contentMeta: ReportItem[]
  loading: boolean

  // 핸들러
  handleNewReport: () => void
  handleDeleteReport: (reportId: string) => void
  handleReportClick: (reportId: string) => void
}
