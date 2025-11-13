// Daily Summary 페이지 관련 타입 정의

export interface AiReportInfo {
  generatedAt: string // 자동 생성 시각 (예: "2025-09-10 13:16 KST")
  verificationSources: number // 검증 출처 개수
  model: string // 생성 모델 (예: "Ko-R1·Qwen2.5")
}

export interface NewsItem {
  id: string
  title: string
  source: string // 뉴스사
  link: string
}

export interface MarketIndex {
  name: string // 지수명
  value: string // 종가 (값 + 단위)
  change: string // 전일 대비 (퍼센트)
  changeValue?: string // 전일 대비 절대값 (값 + 단위)
  changeValueIsPositive?: boolean // 전일 대비 절대값 상승 여부
  unit?: string // 단위 (예: $, 원)
  isPositive?: boolean // 상승/하락 여부 (전일 대비 퍼센트 기준)
}

export interface MarketChart {
  title: string // 차트 제목 (예: "코스피", "코스닥")
  date: string // 차트 날짜 (예: "9월 30일")
  imageUrl?: string // 차트 이미지 URL (옵션)
}

export interface DailySummaryData {
  id: string
  title: string
  aiReportInfo: AiReportInfo
  marketKeywords: string[] // 오늘의 금융시장 키워드 리스트
  topNews: NewsItem[] // 주요 뉴스 10선 (최대 10개)
  marketTrends: MarketChart[] // 시장 추세 그래프 (코스피, 코스닥)
  globalIndices: MarketIndex[] // 글로벌 지수 및 주요 시장 지표
  exchangeRates: MarketIndex[] // 환율 및 채권 수익률
  commodityPrices: MarketIndex[] // 원자재 가격
  aiInsights: string // 주요 요약 및 AI 인사이트

}
