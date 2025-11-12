import * as T from './types'

export const mocks = {
  RECOMMEND_QUESTIONS: {
    status: 200,
    message: 'Success',
    data: [
      {
        id: '1',
        text: '전일 뉴욕증시 주요 뉴스 요약해줘',
      },
      {
        id: '2',
        text: '전일 증시 요약해줘',
      },
      {
        id: '3',
        text: '테슬라 최신 어닝콜 요약해줘',
      },
      {
        id: '4',
        text: '삼성전자와 엔비디아 비교 분석해줘',
      },
    ],
    trace: null,
    path: '/recommend-questions',
  } satisfies T.RecommendQuestionsResponse,
  POPULAR_QUESTIONS: {
    status: 200,
    message: 'Success',
    data: [
      {
        id: '1',
        text: 'QQQ',
      },
      {
        id: '2',
        text: '애플 목표주가 알려줘',
      },
      {
        id: '3',
        text: '요즘 투자자들이 주목하는 섹터가 궁금해',
      },
      {
        id: '4',
        text: '팔란티어 실적 발표 후 주가 반응은 어땠어?',
      },
    ],
    trace: null,
    path: '/popular-questions',
  } satisfies T.PopularQuestionsResponse,
  POPULAR_STOCKS: {
    status: 200,
    message: 'Success',
    data: [
      {
        id: '1',
        name: '삼성전자',
        ticker: '005930',
      },
      {
        id: '2',
        name: 'SK하이닉스',
        ticker: '000660',
      },
      {
        id: '3',
        name: 'LG에너지솔루션',
        ticker: '373220',
      },
      {
        id: '4',
        name: '엔비디아',
        ticker: 'NVDA',
      },
      {
        id: '5',
        name: '애플',
        ticker: 'AAPL',
      },
      {
        id: '6',
        name: '스타벅스',
        ticker: 'SBUX',
      },
    ],
    trace: null,
    path: '/popular-stocks',
  } satisfies T.PopularStocksResponse,
}
