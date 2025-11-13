import type { DailyReportTheme } from '@/types/dailyReport'

// 보고서에서 섹션 제목과 강조 단어를 정의하는 설정 타입
export interface ReportThemeConfig {
  newsTitle: string
  tableTitle: string
  analysisTitle: string
  highlightWord?: string
}

// 일간, 주간, 월간 보고서에서 재사용할 테마별 텍스트 설정
const reportThemeConfigMap: Record<DailyReportTheme, ReportThemeConfig> = {
  FOREX: {
    newsTitle: '환율 관련 데일리 주요 뉴스',
    tableTitle: '주요 통화 현황',
    analysisTitle: '전망과 분석',
    highlightWord: '환율',
  },
  AI: {
    newsTitle: 'AI 테마 관련 데일리 주요 뉴스',
    tableTitle: 'AI 관련 주요 종목',
    analysisTitle: '전망과 분석',
    highlightWord: 'AI 테마',
  },
  DIVIDEND: {
    newsTitle: '배당 상품 관련 데일리 주요 뉴스',
    tableTitle: '고배당 종목/ETF 현황',
    analysisTitle: '전망과 분석',
    highlightWord: '배당',
  },
  GENERAL: {
    newsTitle: '주요 뉴스',
    tableTitle: '주요 데이터',
    analysisTitle: '전망과 분석',
    highlightWord: '',
  },
}

// 테마에 맞는 설정을 반환하며, 존재하지 않을 경우 기본 GENERAL 설정을 사용
export const getReportThemeConfig = (theme: DailyReportTheme): ReportThemeConfig => {
  const themeConfig = reportThemeConfigMap[theme]

  if (themeConfig) {
    return themeConfig
  }

  return reportThemeConfigMap.GENERAL
}



