import { formatMarketGraphDate } from '@/utils/marketGraphs'

import { DailyReportData } from '@/types/dailyReport'
import type { DailyReportGraph } from '@/types/dailyReport'

import {
  DailyReportDTO,
  DailyReportTheme,
  GetDailyReportRequest,
  GetDailyReportResponse,
  GetDailyReportsByThemeRequest,
  GetDailyReportsByThemeResponse,
} from '@/services/daily-report/types'

export type DailyReportModel = DailyReportData

export type GetDailyReportRequestModel = {
  id: string
}

export type GetDailyReportsByThemeRequestModel = {
  theme: DailyReportTheme
}

export type DailyReportListModel = DailyReportModel[]

export const transformGetDailyReportRequestModel = (
  request: GetDailyReportRequestModel,
): GetDailyReportRequest => {
  return {
    id: request.id,
  }
}

export const transformGetDailyReportsByThemeRequestModel = (
  request: GetDailyReportsByThemeRequestModel,
): GetDailyReportsByThemeRequest => {
  return {
    theme: request.theme,
  }
}

export const transformDailyReportResponseDTO = (
  response: GetDailyReportResponse,
): DailyReportModel => {
  return mapDailyReportDtoToModel(response)
}

export const transformDailyReportsByThemeResponseDTO = (
  response: GetDailyReportsByThemeResponse,
): DailyReportListModel => {
  return response.map(mapDailyReportDtoToModel)
}

// 변동폭에 부호를 붙이는 함수
const formatDiffWithSign = (diff: number): string => {
  if (Number.isNaN(diff)) {
    return '-'
  }

  if (diff > 0) {
    return `+${diff}%`
  }

  if (diff < 0) {
    return `${diff}%`
  }

  return `${diff}%`
}

const formatChangeValue = (changeValue: string): string => {
  const formattedNumber = Number(changeValue).toFixed(2)
  if (!Number.isFinite(Number(formattedNumber))) {
    return '-'
  }

  const formatter = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const formattedValue = formatter.format(Math.abs(Number(formattedNumber)))

  if (Number(formattedNumber) > 0) {
    return `+${formattedValue}`
  }

  if (Number(formattedNumber) < 0) {
    return `-${formattedValue}`
  }

  return formattedValue
}

// 테마별 테이블 헤더와 데이터 매핑 함수
const getTableConfig = (theme: DailyReportTheme) => {
  switch (theme) {
    case 'DIVIDEND':
      return {
        headers: ['종목/ETF', '현재가(KRW)', '전일 대비(%)'],
        getRowData: (row: any) => ({
          '종목/ETF': row.symbol,
          '현재가(KRW)': `${row.value}`,
          '전일 대비(%)': {
            diff: formatDiffWithSign(row.diff),
            changeValue: formatChangeValue(row.change_value),
            unit: row.unit ?? '',
          },
        }),
      }
    case 'AI':
      return {
        headers: ['종목', '현재가(USD)', '전일 대비(%)'],
        getRowData: (row: any) => ({
          종목: row.symbol,
          '현재가(USD)': `${row.value}`,
          '전일 대비(%)': {
            diff: formatDiffWithSign(row.diff),
            changeValue: formatChangeValue(row.change_value),
            unit: row.unit ?? '',
          },
        }),
      }
    case 'FOREX':
    default:
      return {
        headers: ['통화', '매매기준율', '전일 대비'],
        getRowData: (row: any) => ({
          통화: row.symbol,
          매매기준율: `${row.value}`,
          '전일 대비': {
            diff: formatDiffWithSign(row.diff),
            changeValue: formatChangeValue(row.change_value),
            unit: row.unit ?? '',
          },
        }),
      }
  }
}

const mapDailyReportDtoToModel = (dto: DailyReportDTO): DailyReportModel => {
  const tableConfig = getTableConfig(dto.theme)

  return {
    id: dto.id,
    theme: dto.theme,
    title: dto.title,
    date: dto.date,
    newsData: dto.news_data.map((item) => ({
      title: item.title,
      source: item.publisher,
      link: item.source_url,
      publishedDate: item.published_date,
    })),
    tableData: {
      headers: tableConfig.headers,
      rows: dto.table_data.map((row) => tableConfig.getRowData(row)),
    },
    analysisData: dto.analysis_data,
    graphData: dto.graph_data
      .filter((graphItem) => Boolean(graphItem?.url))
      .map<DailyReportGraph>((graphItem, index) => {
        const baseTitle = graphItem.symbol ? `${graphItem.symbol}` : `그래프 ${index + 1}`
        const resolvedDate = formatMarketGraphDate(graphItem.published_at)

        return {
          url: graphItem.url,
          title: baseTitle,
          date: resolvedDate,
          theme: graphItem.theme,
        }
      }),
  }
}
