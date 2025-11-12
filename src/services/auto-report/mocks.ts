import * as T from './types'

// Mock 데이터 생성 유틸리티
const generateMockReports = (
  type: 'daily' | 'weekly' | 'monthly',
  count: number,
): T.AutoReportItem[] => {
  const reports: T.AutoReportItem[] = []
  const categories: T.AutoReportCategory[] = ['general', 'currency', 'dividend', 'ai']

  for (let i = 1; i <= count; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (i - 1))
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '.')

    reports.push({
      id: `${type}-${i}`,
      title: `${type === 'daily' ? '일간' : type === 'weekly' ? '주간' : '월간'} ${getCategoryName(categories[(i - 1) % 4])} 리포트`,
      date: formattedDate,
      category: categories[(i - 1) % 4],
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    })
  }

  return reports
}

const getCategoryName = (category: T.AutoReportCategory): string => {
  switch (category) {
    case 'general':
      return ''
    case 'currency':
      return '환율'
    case 'dividend':
      return '배당 전략'
    case 'ai':
      return 'AI 테마'
    default:
      return ''
  }
}

// Mock 데이터
export const mockAutoReports = {
  daily: generateMockReports('daily', 26),
  weekly: generateMockReports('weekly', 12),
  monthly: generateMockReports('monthly', 8),
}

// 전체 리포트 목록 (최신순)
export const mockAllAutoReports = [
  ...mockAutoReports.daily,
  ...mockAutoReports.weekly,
  ...mockAutoReports.monthly,
].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

// 페이지네이션 유틸리티
export const paginateReports = (
  reports: T.AutoReportItem[],
  page: number = 1,
  limit: number = 12,
): { reports: T.AutoReportItem[]; pagination: T.GetAutoReportsResponse['pagination'] } => {
  const totalItems = reports.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedReports = reports.slice(startIndex, endIndex)

  return {
    reports: paginatedReports,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_items: totalItems,
      items_per_page: limit,
    },
  }
}

// 특정 리포트 상세 정보 Mock
export const mockAutoReportDetail: T.GetAutoReportDetailResponse = {
  id: 'daily-1',
  title: '일간 환율 리포트',
  date: '2025.05.05',
  category: 'currency',
  content: {
    summary: '오늘의 환율 동향을 분석한 리포트입니다.',
    sections: [
      {
        title: '주요 환율 현황',
        content: '달러 대비 원화 환율이 전일 대비 상승했습니다.',
      },
      {
        title: '환율 전망',
        content: '향후 며칠간 환율 변동성이 지속될 것으로 예상됩니다.',
      },
    ],
    charts: [
      {
        name: '환율 차트',
        image_path: '/charts/currency-chart.png',
      },
    ],
  },
  created_at: '2025-05-05T09:00:00Z',
  updated_at: '2025-05-05T09:00:00Z',
}
