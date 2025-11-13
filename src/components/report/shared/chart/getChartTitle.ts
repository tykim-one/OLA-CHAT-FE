import type { DailyReportGraph } from '@/types/dailyReport'

interface GetChartTitleParams {
  graphItem: DailyReportGraph
  index: number
}

// 그래프 타이틀을 계산하는 유틸리티 함수: 타이틀이 없을 경우 인덱스에 따라 기본 텍스트를 제공합니다.
export const getChartTitle = ({ graphItem, index }: GetChartTitleParams): string => {
  if (graphItem.title) {
    return graphItem.title
  }

  if (index === 0) {
    return '7일간 가격변동'
  }

  return '30일간 가격변동'
}



