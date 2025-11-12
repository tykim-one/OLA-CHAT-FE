import {
  type MarketGraphTheme,
  formatMarketGraphDate,
  getDefaultMarketGraphThemes,
  getMarketGraphLabels,
  groupMarketGraphs,
} from '@/utils/marketGraphs'

import { api } from '@/lib/http'

import { dailyReportEndpoints } from './endpoints'
import type {
  DailyItemInfoResponse,
  DailyLlmContentResponse,
  DailyReportDTO,
  DailyReportMetaResponse,
  DailyReportTheme,
  DailyReportThemeGraphResponse,
  GetDailyReportRequest,
  GetDailyReportResponse,
  GetDailyReportsByThemeRequest,
  GetDailyReportsByThemeResponse,
  ThemeNewsResponse,
} from './types'

const normalizeGraphs = (graphs: DailyReportThemeGraphResponse): DailyReportThemeGraphResponse => {
  const defaultThemes = getDefaultMarketGraphThemes() as MarketGraphTheme[]
  const groupedGraphs = groupMarketGraphs(graphs, defaultThemes)

  return defaultThemes.flatMap((theme) => {
    const items = groupedGraphs[theme]

    if (items.length === 0) {
      return []
    }

    return items.map((item) => {
      const resolvedTheme = item.theme ?? theme

      return {
        ...item,
        theme: resolvedTheme,
        published_date: formatMarketGraphDate(item.published_at),
      }
    })
  })
}

const buildDailyReportDto = (
  meta: DailyReportMetaResponse,
  news: ThemeNewsResponse,
  contents: DailyLlmContentResponse,
  items: DailyItemInfoResponse,
  graphs: DailyReportThemeGraphResponse,
): DailyReportDTO => {
  const analysisContent = contents.length > 0 ? contents[0].content : '데이터가 없습니다.'

  return {
    id: meta.uuid,
    theme: meta.theme,
    title: meta.title,
    date: meta.published_at,
    news_data: news,
    table_data: items,
    analysis_data: analysisContent,
    graph_data: normalizeGraphs(graphs),
  }
}

const fetchDailyReportMeta = async (id: string) => {
  return api
    .get<DailyReportMetaResponse>(dailyReportEndpoints.DAILY_REPORT_CONTENT_META(id))
    .then((response) => response.data)
}

const fetchDailyReportNews = async (
  theme: DailyReportTheme,
  publishedAt: string,
  limit?: number,
) => {
  return api
    .get<ThemeNewsResponse>(dailyReportEndpoints.DAILY_REPORT_THEME_NEWS, {
      params: {
        theme,
        published_at: publishedAt,
        limit: limit ?? 6,
      },
    })
    .then((response) => response.data)
}

const fetchDailyReportContent = async (theme: DailyReportTheme, publishedAt: string) => {
  return api
    .get<DailyLlmContentResponse>(dailyReportEndpoints.DAILY_REPORT_LLM_CONTENT, {
      params: {
        theme,
        published_at: publishedAt,
      },
    })

    .then((response) => response.data)
}

const fetchDailyReportItems = async (theme: DailyReportTheme, publishedAt: string) => {
  return api
    .get<DailyItemInfoResponse>(dailyReportEndpoints.DAILY_REPORT_ITEM_INFO, {
      params: {
        theme,
        published_at: publishedAt,
        limit: theme === 'AI' ? 6 : theme === 'DIVIDEND' ? 4 : 8,
      },
    })
    .then((response) => response.data)
}

const fetchDailyReportGraph = async (theme: DailyReportTheme, publishedAt: string) => {
  return api
    .get<DailyReportThemeGraphResponse>(dailyReportEndpoints.DAILY_REPORT_THEME_GRAPH, {
      params: {
        theme,
        published_at: publishedAt,
      },
    })
    .then((response) => response.data)
}

export const getDailyReport = async (
  request: GetDailyReportRequest,
): Promise<GetDailyReportResponse> => {
  const meta = await fetchDailyReportMeta(request.id)

  const [newsResult, contentResult, itemResult, graphResult] = await Promise.allSettled([
    fetchDailyReportNews(meta.theme, meta.published_at),
    fetchDailyReportContent(meta.theme, meta.published_at),
    fetchDailyReportItems(meta.theme, meta.published_at),
    fetchDailyReportGraph(meta.theme, meta.published_at),
  ])

  const safeNews: ThemeNewsResponse = newsResult.status === 'fulfilled' ? newsResult.value : []

  const safeContent: DailyLlmContentResponse =
    contentResult.status === 'fulfilled' ? contentResult.value : []

  const safeItems: DailyItemInfoResponse = itemResult.status === 'fulfilled' ? itemResult.value : []

  const safeGraphs: DailyReportThemeGraphResponse =
    graphResult.status === 'fulfilled' ? graphResult.value : []

  return buildDailyReportDto(meta, safeNews, safeContent, safeItems, safeGraphs)
}

export const getDailyReportsByTheme = async (
  request: GetDailyReportsByThemeRequest,
): Promise<GetDailyReportsByThemeResponse> => {
  const metaResponse = await api
    .get<DailyReportMetaResponse[]>(dailyReportEndpoints.DAILY_REPORT_CONTENT_LIST, {
      params: { theme: request.theme },
    })
    .then((response) => response.data)

  return Promise.all(
    metaResponse.map(async (meta) => {
      const [newsResult, contentResult, itemResult, graphResult] = await Promise.allSettled([
        fetchDailyReportNews(meta.theme, meta.published_at),
        fetchDailyReportContent(meta.theme, meta.published_at),
        fetchDailyReportItems(meta.theme, meta.published_at),
        fetchDailyReportGraph(meta.theme, meta.published_at),
      ])

      const safeNews: ThemeNewsResponse = newsResult.status === 'fulfilled' ? newsResult.value : []

      const safeContent: DailyLlmContentResponse =
        contentResult.status === 'fulfilled' ? contentResult.value : []

      const safeItems: DailyItemInfoResponse =
        itemResult.status === 'fulfilled' ? itemResult.value : []

      const safeGraphs: DailyReportThemeGraphResponse =
        graphResult.status === 'fulfilled' ? graphResult.value : []

      return buildDailyReportDto(meta, safeNews, safeContent, safeItems, safeGraphs)
    }),
  )
}

export const getDailyReportsByThemes = async (
  themes: DailyReportTheme[],
): Promise<Record<DailyReportTheme, DailyReportDTO[]>> => {
  const results = await Promise.all(
    themes.map(async (theme) => {
      const reports = await getDailyReportsByTheme({ theme })
      return { theme, reports }
    }),
  )

  return results.reduce(
    (acc, { theme, reports }) => {
      acc[theme] = reports
      return acc
    },
    {} as Record<DailyReportTheme, DailyReportDTO[]>,
  )
}
