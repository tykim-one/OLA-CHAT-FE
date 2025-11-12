'use client'

import { ComponentType, useEffect, useMemo, useRef, useState } from 'react'

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ErrorBoundary } from 'react-error-boundary'
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { VisualizationType } from '@/types/dataset'
import {
  ChartData,
  ChartLibType,
  RenderChartModel,
  getRenderChartComponentType,
  toChartDataOptions,
  transformChartOptionToDataSetQuery,
  transformDataSetToChartData,
} from '@/types/editor/chart'
import { createTooltipFormatter } from '@/types/editor/chart'

import {
  DataSetProvider,
  DataSetProviderProps,
  useDataSetProvider,
} from '@/providers/DataSetProvider'

import ChartComponent from './CandleChart'
import PieChart from './PieChart'
import RechartsGraph from './RechartsGraph'

interface ChartProps {
  data: ChartData
  blockId: string
  type?: VisualizationType
  colors?: string[]
}

type FormattedDataPoint = {
  name: string
  [key: string]: any
}

// 왼쪽 축 색상과 오른쪽 축 색상을 모두 포함
const defaultColors = [
  // 왼쪽 축 색상

  '#003f5c',
  '#58508d',
  '#bc5090',
  '#ff6361',
  // 오른쪽 축 색상
  '#ffa600',
  '#2a5d78',
  '#7e609f',
  '#d16ea2',
]

export const ViewChartWithDataSet = ({ payload }: { payload: RenderChartModel }) => {
  const dataSetProviderProps = useMemo<DataSetProviderProps>(() => {
    const dataSetQueries = [transformChartOptionToDataSetQuery(payload, '')]

    return {
      dataSetQueries,
      options: {
        throwOnError: true,
        placeholderData: [],
        queryKey: [payload.meta.chartPresetType, payload.target.ticker, payload.meta.options],
        enabled: !payload.chartContent,
      },
    }
  }, [payload])

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={({ resetErrorBoundary }) => {
            useEffect(() => {
              return () => {
                resetErrorBoundary()
              }
            },[])

            return <div onClick={resetErrorBoundary}>Error</div>
          }}
          onError={reset}
        >
          <DataSetProvider
            disabled={!!payload.chartContent}
            dataSetQueries={dataSetProviderProps.dataSetQueries}
            options={dataSetProviderProps.options}
            errorNode={<div>Error</div>}
          >
            <ViewChart payload={payload} />
          </DataSetProvider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export const ViewChart = ({ payload }: { payload: RenderChartModel }) => {
  const { isLoading, data, isFetched, fetchDataSet } = useDataSetProvider()

  const [chartData, setChartData] = useState<ChartData | null>(null)
  
  const ChartComponentMemo = useMemo<ComponentType<ChartProps>>(() => {
    const renderChartComponentType = getRenderChartComponentType(
      payload.meta,
      payload.meta.visualizationType,
    )

    if (!renderChartComponentType) {
      return ErrorChart
    }
    const [chartType, [visualType]] = renderChartComponentType
    const chartComponents: {
      [k in ChartLibType]:
        | ComponentType<ChartProps>
        | Partial<Record<VisualizationType, ComponentType<ChartProps>>>
    } = {
      tradingview: {
        line: LineChartTradingView,
        candlestick: CandleStickChartTradingView,
      },
      recharts: {
        line: RechartsGraphWrapper,
        bar: RechartsGraphWrapper,
        pie: PieChartRecharts, // 여기를 PieChartRecharts로 변경
        stack_bar: RechartsGraphWrapper,
      },
    }

    return typeof chartComponents[chartType] === 'function'
      ? (chartComponents[chartType] as ComponentType<ChartProps>)
      : (
          chartComponents[chartType] as Partial<
            Record<VisualizationType, ComponentType<ChartProps>>
          >
        )?.[visualType] || ErrorChart
  }, [payload.meta])

  useEffect(() => {
    if (!data?.length || !!payload.chartContent) {
      return
    }

    const dataSet = data[0]
    const chartDataOptions = toChartDataOptions(dataSet, payload)

    const newChartData = transformDataSetToChartData(dataSet, chartDataOptions)

    setChartData(newChartData)
  }, [payload, data])

  useEffect(() => {
    if (!payload.chartContent) return

    const chartDataOptions = toChartDataOptions(payload.chartContent, payload)

    const newChartData = transformDataSetToChartData(payload.chartContent, chartDataOptions)

    setChartData(newChartData)
  }, [payload, payload.chartContent])

  if (isLoading) {
    return (
      <div className="w-full h-[350px] flex justify-center items-center">
        <div>Loading...</div>
      </div>
    )
  }

  if ((isFetched && !data?.length) || (!payload.chartContent && !data?.[0]?.rows.length)) {
    return <div>No Data</div>
  }

  return (
    <div className="w-full h-full py-1">
      <ChartComponentMemo
        data={chartData!}
        blockId={''}
        type={payload.meta.visualizationType as VisualizationType}
        colors={defaultColors}
      />
    </div>
  )
}

/**
 * TradingView 기반 라인 차트 (원래 candlestick 형태로 변환하던 부분을 series의 x, y 값으로 사용)
 */

export const RechartsGraphWrapper = ({ data, blockId, type, colors }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  return (
    <div
      ref={chartRef}
      className="w-full flex flex-col items-center justify-start overflow-visible"
    >
      <RechartsGraph
        width={700}
        height={250}
        data={data}
        type={type || 'line'}
        colors={colors || defaultColors}
        tooltipFormatter={createTooltipFormatter(data)}
        responsive
      />
    </div>
  )
}

export const LineChartTradingView = ({ data, blockId }: ChartProps) => {
  if (!data || !data.series || data.series.length === 0) return null

  const formatDate = (date: number | string) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  const priceData =
    data.series
      .find((series) => series.name === 'price')
      ?.data.map((point) => {
        const price = Number(point.y)
        return {
          time: formatDate(point.x),
          open: price,
          high: price,
          low: price,
          close: price,
        }
      }) || []

  const volumeData =
    data.series
      .find((series) => series.name === 'volume')
      ?.data.map((point) => ({
        time: formatDate(point.x),
        value: Number(point.y),
        color: Number(point.y) >= 0 ? '#26a69a' : '#ef5350',
      })) || []

  return (
    <ChartComponent priceData={priceData} volumeData={volumeData} blockId={blockId} type="line" />
  )
}

export const CandleStickChartTradingView = ({ data, blockId }: ChartProps) => {
  if (!data || !data.series || data.series.length === 0) return null

  const formatDate = (date: number | string) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  const ohlcSeries = data.series.find((s) => {
    return s.data[0]?.y && typeof s.data[0].y === 'object' && 'open' in s.data[0].y
  })

  if (!ohlcSeries) return null

  const priceData = ohlcSeries.data.map((point) => {
    const ohlc = point.y as { open: number; high: number; low: number; close: number }
    return {
      time: formatDate(point.x),
      open: ohlc.open,
      high: ohlc.high,
      low: ohlc.low,
      close: ohlc.close,
    }
  })

  const volumeData =
    data.series
      .find((series) => series.type === 'bar')
      ?.data.map((point) => ({
        time: formatDate(point.x),
        value: Number(point.y),
        color: Number(point.y) >= 0 ? '#26a69a' : '#ef5350',
      })) || []

  const maSeriesData = data.series
    .filter((series) => series.type === 'line')
    .map((series) => {
      const dayMatch = series.name.match(/^(\d+)-Day/)
      const days = dayMatch ? parseInt(dayMatch[1]) : 0

      return {
        days,
        data: series.data.map((point) => ({
          time: formatDate(point.x),
          value: Number(point.y),
        })),
      }
    })
    .filter((item) => item.days > 0)
    .sort((a, b) => a.days - b.days)

  const maData = {
    ma5: maSeriesData.find((item) => item.days === 5)?.data || [],
    ma10: maSeriesData.find((item) => item.days === 10)?.data || [],
    ma20: maSeriesData.find((item) => item.days === 20)?.data || [],
    ma50: maSeriesData.find((item) => item.days === 50)?.data || [],
    ma120: maSeriesData.find((item) => item.days === 120)?.data || [],
  }

  return (
    <div>
      <ChartComponent
        priceData={priceData}
        volumeData={volumeData}
        blockId={blockId}
        type="candlestick"
        maData={maData}
      />
    </div>
  )
}

/**
 * Recharts 기반 라인 차트 (rawData 대신 series의 x, y 값 사용)
 */
export const LineChartRecharts = ({ data, blockId }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  const formattedData: FormattedDataPoint[] = []

  data.series.forEach((series) => {
    series.data.forEach((point, idx) => {
      if (!formattedData[idx]) {
        formattedData[idx] = {
          name: String(point.x),
        }
      }

      formattedData[idx][series.name] = Number(point.y)
    })
  })

  const chartTitle = data.metadata?.title || ''

  return (
    <div
      ref={chartRef}
      className="w-full h-[500px] min-h-[400px] flex flex-col items-center justify-center"
    >
      {chartTitle && (
        <div className="flex items-center mb-2 w-full justify-between relative">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <h3 className="text-lg font-semibold">{chartTitle}</h3>
          </div>
          <div className="flex-1"></div>
          <img src="/images/logo_black.png" alt="Logo" className="h-5 object-contain z-10" />
        </div>
      )}

      <RechartsGraph
        width={800}
        height={400}
        data={formattedData}
        xAxisLabel={data.axes.x.label}
        yAxisLabel={data.axes.y.primary.label}
        yAxisLabelRight={data.axes.y.secondary?.label}
        responsive
        showGrid
        lines={data.series.map((series, index) => {
          return {
            dataKey: series.name,
            color: defaultColors[index % defaultColors.length],
            yAxisId: series.yAxisId === 'secondary' ? 'right' : 'left',
          }
        })}
        strokeWidth={1}
        hideDots={false}
      />
    </div>
  )
}

/**
 * Recharts 기반 파이 차트 (ChartData를 파이 차트 형태로 변환)
 */
export const PieChartRecharts = ({ data, blockId, colors = defaultColors }: ChartProps) => {
  if (!data) return null

  const chartTitle = data.metadata?.title || ''

  // ChartData를 파이 차트용 데이터로 변환
  const pieData =
    data.series[0]?.data.map((point) => ({
      name: String(point.x),
      value: typeof point.y === 'number' ? point.y : 0,
    })) || []

  // 유효한 데이터가 없는 경우
  if (pieData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center border border-dashed">
        <div>No valid data for pie chart</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] min-h-[400px] flex flex-col items-center justify-center">
      {chartTitle && <h3 className="text-lg font-semibold mb-4">{chartTitle}</h3>}
      <div className="w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length] || `hsl(${index * 30}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => value + '%'}
              contentStyle={{ fontSize: 14, fontWeight: 'bold' }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 14,
                fontWeight: 'bold',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/**
 * Recharts 기반 바 차트 (rawData 대신 series의 x, y 값 사용)
 */
export const BarChartRecharts = ({ data, blockId }: ChartProps) => {
  if (!data) return null

  const formattedData: FormattedDataPoint[] = []

  data.series.forEach((series) => {
    series.data.forEach((point, idx) => {
      if (!formattedData[idx]) {
        formattedData[idx] = {
          name: String(point.x),
        }
      }

      formattedData[idx][series.name] = Number(point.y)
    })
  })

  const chartTitle = data.metadata?.title || ''

  return (
    <div className="w-full h-[500px] min-h-[400px] flex flex-col items-center justify-center">
      {chartTitle && <h3 className="text-lg font-semibold mb-2">{chartTitle}</h3>}
      <RechartsGraph
        width={800}
        height={400}
        data={formattedData}
        xAxisLabel={data.axes.x.label}
        yAxisLabel={data.axes.y.primary.label}
        yAxisLabelRight={data.axes.y.secondary?.label}
        responsive
        showGrid
        bars={data.series.map((series, index) => {
          return {
            dataKey: series.name,
            color: defaultColors[index % defaultColors.length],
            yAxisId: series.yAxisId === 'secondary' ? 'right' : 'left',
          }
        })}
        strokeWidth={1}
        hideDots={false}
      />
    </div>
  )
}

export const ErrorChart = () => {
  return (
    <div>
      If you create the selected graph, it may not appear correctly. Please check the graph type.
    </div>
  )
}
