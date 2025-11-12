import { DailySummaryData } from '@/types/dailySummary'

export const getDailySummaryMock = (id: string): DailySummaryData => ({
  id,
  title: '일간 리포트',
  aiReportInfo: {
    generatedAt: '2025-09-10 13:16 KST',
    verificationSources: 12,
    model: 'Ko-R1·Qwen2.5',
  },
  marketKeywords: [
    '미, WTO 체제 종식 선언 가능성 이슈로 관세·공급망 변동성 확대 시사.',
    '연준 인사, 연내 3차례 인하 필요 발언 재확인. 고용 둔화 → 성장 방어 논리 강화.',
    '국내 주택·재개발 정책 패키지 발표 임박 관측. 내수·건설 경기 부양 기대/부담 공존.',
  ],
  topNews: [
    {
      id: '1',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/1',
    },
    {
      id: '2',
      title:
        '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다. 너무 길어지면 ...',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/2',
    },
    {
      id: '3',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/3',
    },
    {
      id: '4',
      title:
        '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다. 너무 길어지면 ...',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/4',
    },
    {
      id: '5',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/5',
    },
    {
      id: '6',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/6',
    },
    {
      id: '7',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/7',
    },
    {
      id: '8',
      title:
        '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다. 너무 길어지면 ...',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/8',
    },
    {
      id: '9',
      title: '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다.',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/9',
    },
    {
      id: '10',
      title:
        '제목이 들어갑니다. 제목은 두 줄 까지 들어갈 수 있습니다. 너무 길어지면 ...',
      source: '뉴스사가들어갑니다',
      link: 'https://example.com/news/10',
    },
  ],
  marketTrends: [{ title: '코스피', date: '2025-09-10' }, { title: '코스닥', date: '2025-09-10' }],
  globalIndices: [
    { name: '코스피', value: '3,210.01', change: '▲ 0.72%', isPositive: true },
    { name: '코스닥', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
    { name: 'S&P 500', value: '3,210.01', change: '▲ 0.72%', isPositive: true },
    { name: '나스닥', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
    { name: '다우 존스', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
  ],
  exchangeRates: [
    { name: 'USD/KRW', value: '3,210.01', change: '▲ 0.72%', isPositive: true },
    { name: 'EUR/USD', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
    { name: 'USD/JPY', value: '3,210.01', change: '▲ 0.72%', isPositive: true },
    { name: 'USD/CNY', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
  ],
  commodityPrices: [
    { name: '브렌트유 (WTI)', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
    { name: '원유 (Crude Oil)', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
    { name: '금 (Gold)', value: '3,210.01', change: '▲ 0.72%', isPositive: true },
    { name: '구리 (Copper)', value: '3,210.01', change: '▲ 0.72%', isPositive: false },
  ],
  aiInsights:
    '글로벌 기업들의 투자와 정책도 눈길을 끕니다. 애플은 반도체 공급망 강화를 위한 대규모 투자 계획을 발표해 나스닥과 기술주 중심의 상승을 이끌었고, 중국은 미국에 고대역폭메모리(HBM) 규제 완화를 요구해 삼성전자와 SK하이닉스에 기회와 위험을 동시에 안겼습니다. 트럼프 대통령은 미국의 AI 패권 유지를 위해 대규모 지원을 약속하며 AI 관련주가 강세를 이어가고 있습니다. 조선업 호황으로 한국 조선주와 관련 ETF가 높은 수익률을 기록하는 가운데, 정부의 1%대 성장률 전망을 둘러싼 논쟁과 트럼프 리스크가 앞으로의 시장 변수로 떠오르고 있습니다. 금 가격은 관세 우려와 안전자산 선호로 사상 최고치를 경신했고, 미국 원유 재고 감소로 국제 유가도 오름세를 보였습니다.',
})

