import type { DailyReportData, DailyReportMetaInfo } from '@/types/dailyReport'

import type { DailyReportTheme } from './types'

// Mock에서 사용하는 타입들 정의
type DailyReportSectionQueries = {
  news: string
  contents: string
  table: string
}

type DailyReportSections = {
  news: Array<{
    title: string
    source?: string
    link?: string
  }>
  contents: string
  table: {
    headers: string[]
    rows: Record<string, string>[]
  }
}

type TableDataDTO = {
  headers: string[]
  rows: Record<string, string>[]
}

const mockDailyReports: Record<string, DailyReportData> = {
  '1': {
    id: '1',
    theme: 'FOREX',
    title: "IBK 자산관리 How's: Daily 환율 리포트",
    date: '2025. 8. 16.',
    newsData: [
      {
        title: '환율, 美 금리 인하 기대에 1,380원대로 하락',
        source: '연합뉴스',
        link: '#',
      },
      {
        title: '하락 출발했던 환율, 반등 마감…1392.5원',
        source: 'SBS Biz',
        link: '#',
      },
      {
        title: "환율_왜 오르기만하나 했더니…해외투자가 '발목'",
        source: '이데일리',
        link: '#',
      },
      {
        title: '환율, 美 금리 인하 기대에 하락세···1390원',
        source: '직썰',
        link: '#',
      },
      {
        title: '원/달러 환율, 美 금리 인하 기대감에 장 초반 하락',
        source: '헬로티',
        link: '#',
      },
      {
        title: '환율, 美 고용지표 경계감에 반등…0.2원 오른 1,392.5원',
        source: '연합뉴스',
        link: '#',
      },
      {
        title: '4일 원/달러 환율, 전날보다 0.2원 올라',
        source: '키즈맘',
        link: '#',
      },
      {
        title: '美 고용지표 경계감…원·달러 환율 소폭 상승 마감 [김혜란의 FX]',
        source: '서울경제',
        link: '#',
      },
    ],
    tableData: {
      headers: ['통화', '현재값', '전일 대비'],
      rows: [
        { 통화: 'USD/KRW', 현재값: '1393.00', '전일 대비': '+0.3%' },
        { 통화: 'EUR/KRW', 현재값: '1500.50', '전일 대비': '-0.2%' },
        { 통화: 'JPY/KRW', 현재값: '9.10', '전일 대비': '+0.1%' },
      ],
    },
    analysisData:
      '블룸버그 컨센서스는 2025년 4분기 달러인덱스가 104.4로 소폭 하락할 것으로 전망. 금리 인하에도 달러 약세 폭은 제한적일 것이며, 국내외 금리차 축소와 지정학적 위험, 원자재 가격 변동성이 환율에 영향을 줄 것으로 예상됨.',
    graphData: [],
  },
  '2': {
    id: '2',
    theme: 'AI',
    title: "IBK 자산관리 How's: AI 테마 리포트",
    date: '2025. 8. 16.',
    newsData: [
      {
        title: 'AI 피해주 됐다…美 소프트웨어 ETF 2조원 순유출',
        source: '한국경제',
        link: '#',
      },
      {
        title: 'SK AX, 신한은행 생성형 AI 플랫폼 구축 사업 착수',
        source: '조선비즈',
        link: '#',
      },
      {
        title: '중국 증시 10년 만에 반등 기대… AI가 저평가 해소 촉매',
        source: '아시아경제',
        link: '#',
      },
      {
        title: "키움운용, 'KIWOOM 한국고배당&미국AI테크' ETF 상장",
        source: '이데일리',
        link: '#',
      },
      {
        title: 'AI 시장 성숙할수록 소프트웨어 주목받을 것…美 AI소프트웨어 ETF 나...',
        source: '한국경제',
        link: '#',
      },
      {
        title: '미래에셋운용 "중국 증시 10년 정체 끝…AI·로봇 ETF로 공략',
        source: '우먼타임스',
        link: '#',
      },
      {
        title: "1명이 100명몫 하는 시대 됐다…산업 현장 'AI 혁신' 핵심은",
        source: '머니투데이',
        link: '#',
      },
      {
        title: '한국고배당주와 미국AI테크주를 섞었더니...2세대 배당성장ETF 나왔다',
        source: '머니투데이',
        link: '#',
      },
    ],
    tableData: {
      headers: ['종목', '현재가 (USD)', '등락률'],
      rows: [
        { 종목: 'NVDA', '현재가 (USD)': '470.23', 등락률: '+0.3%' },
        { 종목: 'MSFT', '현재가 (USD)': '335.45', 등락률: '-0.2%' },
        { 종목: 'AMD', '현재가 (USD)': '115.78', 등락률: '+0.1%' },
        { 종목: 'GOOGL', '현재가 (USD)': '135.64', 등락률: '+0.5%' },
        { 종목: 'META', '현재가 (USD)': '302.12', 등락률: '+1.1%' },
        { 종목: 'SNOW', '현재가 (USD)': '188.45', 등락률: '-0.4%' },
      ],
    },
    analysisData:
      '미국 AI 소프트웨어 ETF 자금 유출로 조정; 중기: 기업 도입 확산·중국 AI·로봇 정책 모멘텀으로 소프트웨어·서비스 재평가 가능성이 큽니다. 코어(빅테크·인프라) + 위성(수익화 가시성 높은 앱) + 방어(고배당+미국 AI 테크 혼합 ETF)로 변동성 관리가 적절합니다.',
    graphData: [],
  },
  '3': {
    id: '3',
    theme: 'DIVIDEND',
    title: "IBK 자산관리 How's: 배당 전략 리포트",
    date: '2025. 8. 16.',
    newsData: [
      {
        title: '배당주 ETF, 분기 배당으로 투자자 관심 집중',
        source: '서울경제',
        link: '#',
      },
      {
        title: '고배당·중배당 ETF 수익률 상위권…배당투자 인기',
        source: '머니투데이',
        link: '#',
      },
      {
        title: '국내 고배당 가치주 펀드 수익률 개선…관심 지속',
        source: '한국경제',
        link: '#',
      },
      {
        title: '국내 배당주 ETF, 높은 시가배당률로 투자자 관심',
        source: '연합뉴스',
        link: '#',
      },
    ],
    tableData: {
      headers: ['종목', '현재가 (KRW)', '배당 수익률'],
      rows: [
        { 종목: '우선주 A', '현재가 (KRW)': '45,300', '배당 수익률': '3.5%' },
        { 종목: '배당 ETF X', '현재가 (KRW)': '12,500', '배당 수익률': '4.2%' },
        { 종목: '고배당 펀드 Y', '현재가 (KRW)': '31,800', '배당 수익률': '3.8%' },
      ],
    },
    analysisData:
      '국내 배당주는 부채비율 안정성과 실적 개선 기대감으로 관심이 높습니다. 2025년 배당 정책 확대와 글로벌 배당 ETF 수요 증가가 긍정적 요인입니다. 배당 성장주와 고배당 ETF를 병행해 분산 투자를 권장합니다.',
    graphData: [],
  },
  '4': {
    id: '4',
    theme: 'GENERAL',
    title: "IBK 자산관리 How's: Daily 주식 리포트",
    date: '2025. 8. 16.',
    newsData: [
      {
        title: '국내 증시, 외국인 매수세로 상승 마감',
        source: '한국경제',
        link: '#',
      },
      {
        title: '반도체 업종 강세…IT 대형주 상승 주도',
        source: '연합뉴스',
        link: '#',
      },
      {
        title: '미국 증시, 기술주 랠리로 나스닥 최고치 경신',
        source: '블룸버그',
        link: '#',
      },
      {
        title: '조선주 강세 지속…수주 기대감 반영',
        source: '서울경제',
        link: '#',
      },
    ],
    tableData: {
      headers: ['종목', '현재가 (KRW)', '등락률'],
      rows: [
        { 종목: '삼성전자', '현재가 (KRW)': '72,000', 등락률: '+1.2%' },
        { 종목: 'SK하이닉스', '현재가 (KRW)': '120,500', 등락률: '+0.8%' },
        { 종목: '현대중공업', '현재가 (KRW)': '102,000', 등락률: '+1.5%' },
      ],
    },
    analysisData:
      '국내 주식 시장은 기술주 주도의 상승세가 이어지고 있습니다. 반도체 업황 개선과 AI 수요 확대가 긍정적으로 작용하며, 조선주 역시 수주 기대감이 고조되고 있습니다. 중장기적으론 포트폴리오 다변화가 필요합니다.',
    graphData: [],
  },
}

export const getDailyReportMock = (id: string): DailyReportData | null => {
  return mockDailyReports[id] ?? null
}

export const getDailyReportsByThemeMock = (theme: DailyReportTheme): DailyReportData[] => {
  return Object.values(mockDailyReports).filter((report) => report.theme === theme)
}

export const getDailyReportMetaMock = (id: string): DailyReportMetaInfo | null => {
  const report = mockDailyReports[id]

  if (!report) {
    return null
  }

  return {
    id: report.id,
    theme: report.theme,
    title: report.title,
    date: report.date,
  }
}

const themeQueries: Record<DailyReportTheme, DailyReportSectionQueries> = {
  FOREX: {
    news: '/daily-report/themes/exchange/news',
    contents: '/daily-report/themes/exchange/contents',
    table: '/daily-report/themes/exchange/table',
  },
  AI: {
    news: '/daily-report/themes/ai/news',
    contents: '/daily-report/themes/ai/contents',
    table: '/daily-report/themes/ai/table',
  },
  GENERAL: {
    news: '/daily-report/themes/stock/news',
    contents: '/daily-report/themes/stock/contents',
    table: '/daily-report/themes/stock/table',
  },
  DIVIDEND: {
    news: '/daily-report/themes/dividend/news',
    contents: '/daily-report/themes/dividend/contents',
    table: '/daily-report/themes/dividend/table',
  },
}

export const getDailyReportQueriesByThemeMock = (
  theme: DailyReportTheme,
): DailyReportSectionQueries => {
  return themeQueries[theme]
}

const mapToDtoSections = (report: DailyReportData): DailyReportSections => {
  return {
    news: report.newsData.map((item) => ({
      title: item.title,
      source: item.source,
      link: item.link,
    })),
    contents: report.analysisData,
    table: {
      headers: report.tableData.headers,
      rows: report.tableData.rows.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key,
            typeof value === 'object' ? (value as any).value : value,
          ]),
        ),
      ),
    },
  }
}

export const getDailyReportSectionsMock = (id: string): DailyReportSections | null => {
  const report = mockDailyReports[id]

  if (!report) {
    return null
  }

  return mapToDtoSections(report)
}

export const getDailyReportNewsByQueryMock = (
  id: string,
  query: string,
): DailyReportSections['news'] => {
  const sections = getDailyReportSectionsMock(id)

  if (!sections) {
    throw new Error(`뉴스 데이터를 찾을 수 없습니다. query: ${query}`)
  }

  return sections.news
}

export const getDailyReportContentsByQueryMock = (
  id: string,
  query: string,
): DailyReportSections['contents'] => {
  const sections = getDailyReportSectionsMock(id)

  if (!sections) {
    throw new Error(`콘텐츠 데이터를 찾을 수 없습니다. query: ${query}`)
  }

  return sections.contents
}

export const getDailyReportTableByQueryMock = (id: string, query: string): TableDataDTO => {
  const sections = getDailyReportSectionsMock(id)

  if (!sections) {
    throw new Error(`테이블 데이터를 찾을 수 없습니다. query: ${query}`)
  }

  return sections.table
}
