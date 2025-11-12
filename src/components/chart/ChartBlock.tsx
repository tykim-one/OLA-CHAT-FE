import { ComponentType, useMemo } from 'react'

import { ChartPresetKey, RenderChartModel } from '@/types/editor/chart'

import FinancialChartWithFinancialMetricsTabs from './FinancialChartWithFinancialMetricsTabs'
import PriceChartWithTimeFrameTabs from './PriceChartWithTimeFrameTabs'
import { ViewChartWithDataSet } from './RenderChart'
import ValuationMultipleChartWithKeyMetricsTabs from './ValuationMultipleChartWithKeyMetricsTabs'

import ChartInfoCard from '../chat/modern/ChartInfoCard'

export type BaseChartBlockProps<T extends RenderChartModel | RenderChartModel[]> = {
  id: string
  payload: T | null
  isOpen?: boolean
}

export type ChartBlockProps = BaseChartBlockProps<RenderChartModel>

export const ChartBlock = ({ id, payload, isOpen }: ChartBlockProps) => {
  const chartInfo = useMemo(() => {
    if (!payload) return null

    const chartInfoMap: Partial<{
      [k in ChartPresetKey]: {
        title: string
        hidden?: boolean
      }
    }> = {
      PRICE_INFORMATION: {
        title: payload.target.ticker,
      },
      INCOME_STATEMENT_TRENDS: {
        title: payload.target.ticker,
      },
      VALUATION_MULTIPLES_CHART: {
        title: payload.target.ticker,
      },
      PRICE_AND_DIVIDEND_CHART: {
        title: payload.target.ticker,
      },
      ETF_WEIGHTS: {
        title: payload.target.ticker,
      },
    }

    return chartInfoMap[payload.meta.chartPresetType]
  }, [payload])

  if (!payload || !chartInfo || chartInfo.hidden) return null

  // PRICE_INFORMATION일 때 타임프레임 탭이 있는 컴포넌트 사용
  const ChartComponent =
    payload.meta.chartPresetType === 'PRICE_INFORMATION'
      ? PriceChartWithTimeFrameTabs
      : ({ payload }: { payload: RenderChartModel }) => <ViewChartWithDataSet payload={payload} />

  return (
    <ChartInfoCard id={id} title={chartInfo.title} isOpen={isOpen}>
      <ChartComponent payload={payload} />
    </ChartInfoCard>
  )
}

export type ChartGroupBlockProps = BaseChartBlockProps<RenderChartModel[]>
export const ChartGroupBlock = ({ id, payload, isOpen }: ChartGroupBlockProps) => {
  const chartInfo = useMemo(() => {
    if (!payload) return null

    const chartInfoMap: Partial<{
      [k in ChartPresetKey]: {
        title: string
        hidden?: boolean
      }
    }> = {
      PRICE_INFORMATION: {
        title: '주가차트',
      },
      INCOME_STATEMENT_TRENDS: {
        title: '재무실적',
      },
      VALUATION_MULTIPLES_CHART: {
        title: '가치평가',
      },
      PRICE_AND_DIVIDEND_CHART: {
        title: '배당금 추이',
      },
      ETF_WEIGHTS: {
        title: '섹터비중',
      },
    }

    const chartGroupType = payload.find((d) => d.meta.chartPresetType)
    if (!chartGroupType) return null

    return chartInfoMap[chartGroupType?.meta.chartPresetType] || null
  }, [payload])

  if (!payload || !chartInfo || chartInfo.hidden) return null

  return (
    <ChartInfoCard
      id={id}
      title={chartInfo.title}
      isOpen={isOpen}
      type={payload[0].meta.chartPresetType}
    >
      <div className="flex flex-col gap-4">
        {payload.map((d, i) => {
          const chartComponentMap: Partial<{
            [k in ChartPresetKey]: ComponentType<{ payload: RenderChartModel }>
          }> = {
            PRICE_INFORMATION: PriceChartWithTimeFrameTabs,
            INCOME_STATEMENT_TRENDS: FinancialChartWithFinancialMetricsTabs,
            VALUATION_MULTIPLES_CHART: ValuationMultipleChartWithKeyMetricsTabs,
            PRICE_AND_DIVIDEND_CHART: ViewChartWithDataSet,
            ETF_WEIGHTS: ViewChartWithDataSet,
          }

          const ChartComponent = chartComponentMap[d.meta.chartPresetType]
          if (!ChartComponent) return null

          return <ChartComponent key={d.meta.chartPresetType + d.target.ticker + i} payload={d} />
        })}
      </div>
    </ChartInfoCard>
  )
}
