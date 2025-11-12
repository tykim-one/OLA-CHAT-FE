import dayjs from 'dayjs'

import {
  type MarketGraphTheme,
  formatMarketGraphDate,
  getDefaultMarketGraphThemes,
  getLegacyMarketGraphThemes,
  getMarketGraphLabels,
  groupMarketGraphs,
} from '@/utils/marketGraphs'

import { api } from '@/lib/http'

import type {
  AiReportInfo,
  DailySummaryData,
  MarketChart,
  MarketIndex,
  NewsItem,
} from '@/types/dailySummary'

import { dailyReportEndpoints } from '@/services/daily-report/endpoints'
import type {
  DailyItemInfoItem,
  DailyItemInfoResponse,
  DailyLlmContentItem,
  DailyLlmContentResponse,
  DailyReportMetaResponse,
  DailyReportTheme,
  ThemeNewsResponse,
} from '@/services/daily-report/types'

export type GetDailySummaryRequest = {
  id: string
}

export type GetDailySummaryResponse = DailySummaryData

const DAILY_SUMMARY_PROMPTS = {
  KEYWORDS: 'TODAY_MARKET_KEYWORDS',
  INSIGHTS: 'SUMMARY_AI_INSIGHTS',
} as const

type DailySummaryGraphResponse = Array<{
  url: string
  theme: string
  published_date: string
  published_at: string
  symbol: string
}>

// 숫자 값을 보기 좋게 표현하기 위한 포매터입니다.
const numberFormatter = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatValueWithUnit = (value: number, unit?: string | null): string => {
  const formatted = numberFormatter.format(value)

  if (!unit) {
    return formatted
  }

  if (unit === '$') {
    return `${unit} ${formatted}`
  } else {
    return `${formatted} ${unit}`
  }
}

const formatChangePercentage = (
  diff?: number | string | null,
): { display: string; isPositive: boolean | undefined } => {
  if ((typeof diff !== 'string' && typeof diff !== 'number') || Number.isNaN(diff)) {
    return { display: '데이터 없음', isPositive: undefined }
  }

  const formatted = numberFormatter.format(Math.abs(Number(diff)))
  if (Number(diff) > 0) {
    return { display: `▲ ${Number(formatted).toFixed(2)}%`, isPositive: true }
  }

  if (Number(diff) < 0) {
    return { display: `▼ ${Number(formatted).toFixed(2)}%`, isPositive: false }
  }

  return { display: '0.00%', isPositive: undefined }
}

const formatChangeValue = (
  changeValue?: number | null,
  unit?: string | null,
): { display?: string; isPositive: boolean | undefined } => {
  if (
    (typeof changeValue !== 'string' && typeof changeValue !== 'number') ||
    Number.isNaN(changeValue)
  ) {
    return { display: undefined, isPositive: undefined }
  }

  const formatted = numberFormatter.format(Math.abs(Number(changeValue)))

  if (Number(changeValue) > 0) {
    return {
      display:
        unit === '$'
          ? `▲ ${unit} ${Number(formatted).toFixed(2)}`
          : unit
            ? `▲ ${Number(formatted).toFixed(2)} ${unit}`
            : `▲ ${Number(formatted).toFixed(2)}`,
      isPositive: true,
    }
  }

  if (Number(changeValue) < 0) {
    return {
      display:
        unit === '$'
          ? `▼ ${unit} ${Number(formatted).toFixed(2)}`
          : unit
            ? `▼ ${Number(formatted).toFixed(2)} ${unit}`
            : `▼ ${Number(formatted).toFixed(2)}`,
      isPositive: false,
    }
  }

  return {
    display: unit === '$' ? `0.00 ${unit}` : unit ? `0.00 ${unit}` : '0.00',
    isPositive: undefined,
  }
}

// 공통으로 사용하는 theme, published_at query 파라미터를 생성합니다.
const buildReportParams = (
  theme: DailyReportTheme | string,
  publishedAt?: string,
  limit?: number,
) => {
  const params: Record<string, string> = { theme }

  if (publishedAt) {
    params.published_at = publishedAt
  }

  if (limit) {
    params.limit = limit.toString()
  }

  return params
}

// 리포트 메타 정보를 불러옵니다.
const fetchDailySummaryMeta = async (id: string): Promise<DailyReportMetaResponse> => {
  return api
    .get<DailyReportMetaResponse>(dailyReportEndpoints.DAILY_REPORT_CONTENT_META(id))
    .then((response) => response.data)
}

// LLM 콘텐츠(키워드, AI 인사이트 등)를 불러옵니다.
const fetchDailySummaryContent = async (
  theme: DailyReportTheme,
  publishedAt?: string,
): Promise<DailyLlmContentResponse> => {
  return api
    .get<DailyLlmContentResponse>(dailyReportEndpoints.DAILY_REPORT_LLM_CONTENT, {
      params: buildReportParams(theme, publishedAt),
    })
    .then((response) => response.data)
}

// 지수, 환율, 원자재 데이터를 불러옵니다.
const fetchDailySummaryItemInfo = async (
  theme: DailyReportTheme,
  publishedAt?: string,
): Promise<DailyItemInfoResponse> => {
  return api
    .get<DailyItemInfoResponse>(dailyReportEndpoints.DAILY_REPORT_ITEM_INFO, {
      params: buildReportParams(theme, publishedAt),
    })
    .then((response) => {
      return response.data
    })
}

// 뉴스 데이터를 불러옵니다.
const fetchDailySummaryNews = async (
  theme: DailyReportTheme,
  publishedAt?: string,
  limit = 10,
): Promise<ThemeNewsResponse> => {
  return api
    .get<ThemeNewsResponse>(dailyReportEndpoints.DAILY_REPORT_THEME_NEWS, {
      params: buildReportParams(theme, publishedAt, limit),
    })
    .then((response) => response.data)
}

// 시장 그래프 이미지를 불러옵니다.
const fetchDailySummaryGraph = async (
  theme: DailyReportTheme | string,
  publishedAt?: string,
): Promise<DailySummaryGraphResponse> => {
  return api
    .get<DailySummaryGraphResponse>(dailyReportEndpoints.DAILY_REPORT_THEME_GRAPH, {
      params: buildReportParams('GENERAL', publishedAt),
    })
    .then((response) => response.data)
}

// 발행 일자를 사람이 읽기 쉬운 문자열로 변환합니다.
const buildGeneratedAt = (publishedAt?: string): string => {
  if (!publishedAt) {
    return '발행일 정보 없음'
  }

  const parsedDate = dayjs(publishedAt)

  if (!parsedDate.isValid()) {
    return publishedAt
  }

  // YYYY-MM-DD HH:mm KST 형식으로 포맷
  return parsedDate.format('YYYY-MM-DD HH:mm') + ' KST'
}

// 메타 정보와 LLM 응답을 조합해 AI 리포트 정보를 구성합니다.
const buildAiReportInfo = (
  meta: DailyReportMetaResponse,
  aiContent?: DailyLlmContentItem,
): AiReportInfo => {
  return {
    generatedAt: buildGeneratedAt(meta.published_at),
    verificationSources: aiContent?.source_urls?.length ?? 0,
    model: aiContent?.model_name ?? '알 수 없음',
  }
}

// 하이픈으로 나열된 문자열을 배열로 변환합니다.
const splitBulletContent = (content?: string): string[] => {
  if (!content) {
    return []
  }

  const normalized = content.replace(/\s+-\s+/g, '\n- ')

  return normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('- ') ? line.slice(2).trim() : line))
    .filter(Boolean)
}

// AI 인사이트 본문을 보기 좋은 형식의 문자열로 변환합니다.
const buildAiInsights = (content?: string): string => {
  if (!content) {
    return ''
  }

  const lines = splitBulletContent(content)

  if (lines.length === 0) {
    return content.trim()
  }

  return lines.map((line) => `• ${line}`).join('\n')
}

// LLM 응답에서 특정 프롬프트에 해당하는 항목을 찾습니다.
const extractContentByPrompt = (
  contents: DailyLlmContentResponse,
  prompt: string,
): DailyLlmContentItem | undefined => {
  return contents.find((content) => content.prompt === prompt)
}

// 뉴스 응답을 화면에 맞는 형태로 변환합니다.
const mapNewsItems = (news: ThemeNewsResponse): NewsItem[] => {
  return news.map((item, index) => {
    const idBase = item.source_url ?? `${item.theme}-${item.published_at ?? index}`

    return {
      id: idBase,
      title: item.title,
      source: item.publisher,
      link: item.source_url ?? '#',
    }
  })
}

// 지수·환율 데이터를 MarketIndex 형태로 변환합니다.
const toMarketIndex = (item: DailyItemInfoItem): MarketIndex => {
  const { symbol, value, diff, unit, change_value } = item

  const percentage = formatChangePercentage(diff)
  const absChange = formatChangeValue(change_value, unit)

  return {
    name: symbol,
    value: formatValueWithUnit(value, unit),
    change: percentage.display,
    changeValue: absChange.display,
    changeValueIsPositive: absChange.isPositive,
    unit: unit ?? undefined,
    isPositive: percentage.isPositive,
  }
}

// 아이템 응답에서 theme 정보를 추출합니다.
const extractItemTheme = (item: DailyItemInfoResponse[number]): string => {
  // API 응답에서 theme 필드를 사용합니다.
  return (item.theme ?? item.item_type ?? '').toUpperCase()
}

// 원하는 theme 목록에 해당하는 지수들을 가져옵니다.
const mapItemInfoByThemes = (
  items: DailyItemInfoResponse,
  targetThemes: string[],
): MarketIndex[] => {
  const normalizedTargets = targetThemes.map((theme) => theme.toUpperCase())

  const filteredItems = items.filter((item) => {
    const itemTheme = extractItemTheme(item)
    const isMatch = normalizedTargets.includes(itemTheme)

    return isMatch
  })

  return filteredItems.map((item) => toMarketIndex(item))
}

// 그래프 응답을 MarketChart 배열로 변환합니다.
const buildMarketTrends = (graphs: DailySummaryGraphResponse): MarketChart[] => {
  const defaultThemes = getDefaultMarketGraphThemes()
  const legacyThemes = getLegacyMarketGraphThemes()
  const allowedThemes = new Set<MarketGraphTheme>([...defaultThemes, ...legacyThemes])

  const normalizedItems = graphs.map((item) => {
    const candidateFromSymbol = item.symbol?.toUpperCase()
    if (candidateFromSymbol && allowedThemes.has(candidateFromSymbol as MarketGraphTheme)) {
      return {
        ...item,
        theme: candidateFromSymbol as MarketGraphTheme,
      }
    }

    const candidateFromTheme = item.theme?.toUpperCase()
    if (candidateFromTheme && allowedThemes.has(candidateFromTheme as MarketGraphTheme)) {
      return {
        ...item,
        theme: candidateFromTheme as MarketGraphTheme,
      }
    }

    return {
      ...item,
      theme: 'GENERAL' as MarketGraphTheme,
    }
  })

  const groupedGraphs = groupMarketGraphs<(typeof normalizedItems)[number]>(normalizedItems)
  const themesFromData = Object.keys(groupedGraphs) as MarketGraphTheme[]
  const normalizedThemes = themesFromData.length > 0 ? themesFromData : defaultThemes
  const labels = getMarketGraphLabels(normalizedThemes)

  return normalizedThemes.flatMap((theme) => {
    const items = groupedGraphs[theme] ?? []

    if (items.length === 0) {
      return []
    }

    return items.map((item) => {
      const symbolLabel = item.symbol?.toString().trim()
      const fallbackLabel = labels[theme] ?? String(theme)
      const title = symbolLabel || fallbackLabel

      return {
        title,
        date: formatMarketGraphDate(item.published_at),
        imageUrl: item.url,
      }
    })
  })
}

export const getDailySummary = async (
  request: GetDailySummaryRequest,
): Promise<GetDailySummaryResponse> => {
  if (!request.id) {
    throw new Error('일간 요약 데이터를 가져오려면 report id가 필요합니다.')
  }

  // 1. 메타 정보를 불러온 뒤, 발행일과 테마를 기반으로 나머지 데이터를 병렬로 요청합니다.
  const meta = await fetchDailySummaryMeta(request.id)

  const [contentResult, newsResult, itemResult, graphResult] = await Promise.allSettled([
    fetchDailySummaryContent(meta.theme, meta.published_at),
    fetchDailySummaryNews(meta.theme, meta.published_at),
    fetchDailySummaryItemInfo(meta.theme, meta.published_at),
    fetchDailySummaryGraph('GENERAL', meta.published_at),
  ])

  const safeContents = contentResult.status === 'fulfilled' ? contentResult.value : []
  if (contentResult.status === 'rejected') {
    console.warn('Daily Summary API content failed:', contentResult.reason)
  }

  const safeNews = newsResult.status === 'fulfilled' ? newsResult.value : []
  if (newsResult.status === 'rejected') {
    console.warn('Daily Summary API news failed:', newsResult.reason)
  }

  const safeItems = itemResult.status === 'fulfilled' ? itemResult.value : []
  if (itemResult.status === 'rejected') {
    console.warn('Daily Summary API item info failed:', itemResult.reason)
  }

  const safeGraphs = graphResult.status === 'fulfilled' ? graphResult.value : []
  if (graphResult.status === 'rejected') {
    console.warn('Daily Summary API market graphs failed:', graphResult.reason)
  }

  // 2. 섹션별 데이터를 가공합니다.
  const keywordContent = extractContentByPrompt(safeContents, DAILY_SUMMARY_PROMPTS.KEYWORDS)
  const aiInsightContent = extractContentByPrompt(safeContents, DAILY_SUMMARY_PROMPTS.INSIGHTS)

  const marketKeywords = (() => {
    const keywords = splitBulletContent(keywordContent?.content)

    if (keywords.length > 0) {
      return keywords
    }

    // 프롬프트 응답이 없을 때도 UI가 빈 리스트가 아닌 안내 문구를 보여주도록 기본 값을 제공합니다.
    return ['데이터를 불러올 수 없습니다.']
  })()

  const aiInsights = (() => {
    const insights = buildAiInsights(aiInsightContent?.content)

    if (insights) {
      return insights
    }

    // 콘텐츠가 비어 있더라도 사용자가 상황을 인지할 수 있도록 기본 메시지를 반환합니다.
    return '데이터를 불러올 수 없습니다.'
  })()

  const aiReportInfo = buildAiReportInfo(meta, aiInsightContent)
  const topNews = mapNewsItems(safeNews)

  const globalIndices = mapItemInfoByThemes(safeItems, ['GLOBAL_INDEX'])
  const exchangeRates = mapItemInfoByThemes(safeItems, ['FOREX'])
  const commodityPrices = mapItemInfoByThemes(safeItems, [
    'COMMODITY',
    'COMMODITY_PRICE',
    'COMMODITIES',
    'COMMODITY_INDEX',
  ])

  const marketTrends = buildMarketTrends(safeGraphs)

  // 3. DailySummaryData 형태로 응답을 반환합니다.
  return {
    id: meta.uuid ?? request.id,
    title: meta.title ?? '일간 리포트',
    aiReportInfo,
    marketKeywords,
    topNews,
    marketTrends,
    globalIndices,
    exchangeRates,
    commodityPrices,
    aiInsights,
  }
}
