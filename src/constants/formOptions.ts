// 폼 관련 옵션 상수들 (UI 변경 없이 분리)

export const reportTypeOptions = [
  { value: 'monthly-investment', label: '월간 투자전략 가이드' },
  { value: 'weekly-market-review', label: '주간 시장 리뷰' },
  { value: 'daily-briefing', label: '일일 시장 브리핑' },
]

export const periodOptions = [
  { value: 'monthly', label: '월간' },
  { value: 'weekly', label: '주간' },
  { value: 'daily', label: '일간' },
]

export const targetAudienceOptions = [
  { value: 'managed_customer', label: '관리고객' },
  { value: 'potential_customer', label: '가망고객' },
  { value: 'internal_employee', label: '내부직원용' },
  { value: 'self_learning', label: '자가학습용' },
]

// 리포트 유형과 발행 주기 매칭 관계
export const reportTypePeriodMapping = {
  'monthly-investment': 'monthly',
  'weekly-market-review': 'weekly',
  'daily-briefing': 'daily',
} as const

// 템플릿 라벨 매핑
export const templateLabels = {
  'monthly-investment': '월간 투자전략 템플릿',
  'weekly-market-review': '주간 시장 리뷰',
  'daily-briefing': '일일 브리핑',
  'target-analysis': '대상 분석 리포트',
} as const

// 소스 타입 라벨 매핑
export const sourceTypeLabels = {
  api: 'API 연동',
  database: '데이터베이스',
  file: '파일 업로드',
  manual: '수동 입력',
} as const

// 카테고리 매핑
export const categoryMap = {
  market_summary: '시장 전망 브리핑',
  global_economy: '세계 경제 동향',
  global_bond: '해외 채권 동향',
  domestic_stock: '국내 증시 동향',
  domestic_bond: '국내 채권 동향',
  portfolio_recommendation: '추천 투자 포트폴리오',
} as const

// 필수 분석 옵션
export const requiredAnalysisOptions = [
  { value: 'market_summary', label: '시장 전망 브리핑' },
  { value: 'global_economy', label: '세계 경제 동향' },
  { value: 'global_bond', label: '해외 채권 동향' },
  { value: 'domestic_stock', label: '국내 증시 동향' },
  { value: 'domestic_bond', label: '국내 채권 동향' },
  { value: 'portfolio_recommendation', label: '추천 투자 포트폴리오' },
]

// 추가 분석 옵션
export const additionalAnalysisOptions = [
  { value: '글로벌 시장 특징주', label: '글로벌 시장 특징주' },
  { value: '섹터별 추천 전망', label: '섹터별 추천 전망' },
]
