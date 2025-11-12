// 리포트 관련 상수 정의
// import { Step } from '@/components/shared/StepSidebar'

export const imageMapping: Record<string, string> = {
  '시장 전망 요약': '/image.png',
  '글로벌 경제': '/image-1.png',
  '글로벌 채권': '/image-2.png',
  '국내 증시': '/image-3.png',
  '국내 채권': '/image-4.png',
  '시황 관련 상품': '/image-5.png',
}

export const categoryMap: Record<string, string> = {
  market_summary: '시장 전망 요약',
  global_economy: '글로벌 경제',
  global_bond: '글로벌 채권',
  domestic_stock: '국내 증시',
  domestic_bond: '국내 채권',
  portfolio_recommendation: '시황 관련 상품',
}

export const periodImageMap: Record<string, string> = {
  daily: '/daily.png',
  weekly: '/weekly.png',
  monthly: '/monthly.png',
}

// export const REPORT_STEPS: Step[] = [
//   { id: 1, title: '리포트 기본 정보', path: '/report/basic-info' },
//   { id: 2, title: '콘텐츠 설정', path: '/report/content' },
//   { id: 3, title: '미리보기 및 생성', path: '/report/preview' },
// ]

export const steps = [
  {
    title: '자료 수집·정리',
    description:
      '금융 보고서, 실적 발표, 매크로 지표, 뉴스 헤드라인을 크롤링하고 형식을 통일합니다.',
  },
  {
    title: '데이터 분석',
    description: 'AI가 수집된 데이터를 분석하여 주요 인사이트와 트렌드를 파악합니다.',
  },
  {
    title: '리포트 생성',
    description: '분석 결과를 바탕으로 맞춤형 투자전략 리포트를 작성합니다.',
  },
]
