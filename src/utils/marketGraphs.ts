import dayjs from 'dayjs'

import type { DailyReportTheme } from '@/services/daily-report/types'

export type MarketGraphTheme = DailyReportTheme | 'KOSPI' | 'KOSDAQ'

const DEFAULT_MARKET_GRAPH_THEMES: DailyReportTheme[] = ['FOREX', 'AI', 'DIVIDEND', 'GENERAL']

const LEGACY_MARKET_GRAPH_THEMES: MarketGraphTheme[] = ['KOSPI', 'KOSDAQ']

const MARKET_GRAPH_LABELS: Record<MarketGraphTheme, string> = {
  FOREX: '환율 동향',
  AI: 'AI 테마 동향',
  DIVIDEND: '배당 전략 동향',
  GENERAL: '시장 동향',
  KOSPI: '코스피',
  KOSDAQ: '코스닥',
}

const MARKET_GRAPH_KEYWORDS: Record<MarketGraphTheme, string> = {
  FOREX: 'forex',
  AI: 'ai',
  DIVIDEND: 'dividend',
  GENERAL: 'general',
  KOSPI: 'kospi',
  KOSDAQ: 'kosdaq',
}

export type MarketGraphBaseItem = {
  url: string
  published_at?: string
  theme?: MarketGraphTheme
}

export type GroupedMarketGraphs<T extends MarketGraphBaseItem> = Record<MarketGraphTheme, T[]>

const createInitialGroups = <T extends MarketGraphBaseItem>(themes: MarketGraphTheme[]) => {
  return themes.reduce<GroupedMarketGraphs<T>>((accumulator, theme) => {
    accumulator[theme] = []
    return accumulator
  }, {} as GroupedMarketGraphs<T>)
}

const resolveGraphTheme = (graphItem: MarketGraphBaseItem): MarketGraphTheme | undefined => {
  if (graphItem.theme && graphItem.theme in MARKET_GRAPH_LABELS) {
    return graphItem.theme
  }

  const normalizedUrl = graphItem.url.toLowerCase()

  return (Object.keys(MARKET_GRAPH_KEYWORDS) as MarketGraphTheme[]).find((theme) => {
    return normalizedUrl.includes(MARKET_GRAPH_KEYWORDS[theme])
  })
}

export const groupMarketGraphs = <T extends MarketGraphBaseItem>(
  graphs: T[],
  themeOrder: MarketGraphTheme[] = DEFAULT_MARKET_GRAPH_THEMES,
): GroupedMarketGraphs<T> => {
  return graphs.reduce<GroupedMarketGraphs<T>>((accumulator, graphItem) => {
    if (!graphItem?.url) {
      return accumulator
    }

    const matchedTheme = resolveGraphTheme(graphItem)

    if (!matchedTheme) {
      return accumulator
    }

    if (!(matchedTheme in accumulator)) {
      accumulator[matchedTheme] = []
    }

    accumulator[matchedTheme] = [...accumulator[matchedTheme], graphItem]

    return accumulator
  }, createInitialGroups<T>(themeOrder))
}

export const getMarketGraphLabels = (themes: MarketGraphTheme[] = DEFAULT_MARKET_GRAPH_THEMES) => {
  return themes.reduce<Record<MarketGraphTheme, string>>((accumulator, theme) => {
    accumulator[theme] = MARKET_GRAPH_LABELS[theme]
    return accumulator
  }, {} as Record<MarketGraphTheme, string>)
}

export const getDefaultMarketGraphThemes = () => {
  return [...DEFAULT_MARKET_GRAPH_THEMES]
}

export const getLegacyMarketGraphThemes = () => {
  return [...LEGACY_MARKET_GRAPH_THEMES]
}

export const formatMarketGraphDate = (publishedAt?: string): string => {
  if (!publishedAt) {
    return '날짜 정보 없음'
  }

  const parsedDate = dayjs(publishedAt)

  if (!parsedDate.isValid()) {
    return publishedAt
  }

  return parsedDate.format('M월 DD일')
}

