'use client'

import React, { useMemo } from 'react'

import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  Pie,
  ComposedChart as RechartsComposedChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { VisualizationType } from '@/types/dataset'
import { ChartData, createTooltipFormatter } from '@/types/editor/chart'

import CustomTooltip from './CustomTooltip'

type ChartElementType = VisualizationType

interface RechartsDataPoint {
  name: string

  [seriesName: string]: string | number
}

type RechartsData = RechartsDataPoint[]

interface ChartElementBase {
  dataKey: string
  color?: string
  yAxisId?: 'left' | 'right'
  name?: string
  stackId?: string
}

interface LineElement extends ChartElementBase {
  type: 'line'
  strokeWidth?: number
  dotSize?: number
  hideDots?: boolean
  strokeDasharray?: string
}

interface BarElement extends ChartElementBase {
  type: 'bar'
  barSize?: number
  radius?: number | [number, number, number, number]
  fill?: string
}

interface AreaElement extends ChartElementBase {
  type: 'area'
  strokeWidth?: number
  fillOpacity?: number
  fill?: string
  stroke?: string
}

interface ScatterElement extends ChartElementBase {
  type: 'scatter'
  fill?: string
  shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye'
  size?: number
}

interface PieElement extends ChartElementBase {
  type: 'pie'
  fill?: string
  innerRadius?: number
  outerRadius?: number
  paddingAngle?: number
  cornerRadius?: number
  startAngle?: number
  endAngle?: number
  nameKey?: string
  valueKey?: string
}

interface StackBarElement extends ChartElementBase {
  type: 'stack_bar'
  barSize?: number
  radius?: number | [number, number, number, number]
  fill?: string
  stackId?: string
}

type ChartElement =
  | LineElement
  | BarElement
  | AreaElement
  | ScatterElement
  | PieElement
  | StackBarElement

export interface ChartProps {
  data:
    | Array<{
        name: string
        [key: string]: any
      }>
    | ChartData
  blockId?: string
  type?: ChartElementType
  width?: number
  height?: number
  // LineChart와 호환을 위한 속성
  lines?: Array<{
    dataKey: string
    color?: string
    yAxisId?: 'left' | 'right'
  }>
  // BarChart와 호환을 위한 속성
  bars?: Array<{
    dataKey: string
    color?: string
    yAxisId?: 'left' | 'right'
    stackId?: string
    barSize?: number
    radius?: number | [number, number, number, number]
  }>
  elements?: ChartElement[]
  colors?: string[]
  onClick?: (data: any) => void
  onMouseEnter?: (data: any) => void
  onMouseLeave?: () => void
  isAnimationActive?: boolean
  responsive?: boolean
  // LineChart에서 사용하는 속성
  strokeWidth?: number
  lineColor?: string
  areaColor?: string
  dotSize?: number
  hideDots?: boolean
  showGrid?: boolean
  showBrush?: boolean
  referenceLines?: Array<{
    y?: number
    x?: string | number
    label?: string
    color?: string
  }>
  referenceAreas?: Array<{
    x1: string | number
    x2: string | number
    y1?: number
    y2?: number
    fill?: string
    label?: string
  }>
  xAxisLabel?: string
  yAxisLabel?: string
  yAxisLabelRight?: string
  tooltipFormatter?: (value: any, name: string, props?: any) => string | string[]
  legendFormatter?: (value: string) => string
  layout?: 'horizontal' | 'vertical'
  leftAxisTickFormatter?: (value: number) => string
  rightAxisTickFormatter?: (value: number) => string
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
}

// X축 tick 설정을 위한 유틸리티 함수들
const getXAxisTickSettings = (chartData: RechartsData) => {
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return { interval: 0, tickCount: undefined }
  }

  return {
    interval: chartData.length > 5 ? 1 : 0,
    tickCount: 3,
  }
}

const formatSecondaryAxisValue = (
  value: string,
  chartData: RechartsData,
  data: ChartData | RechartsData,
  isChartData: boolean,
): string => {
  // name이 아닌 다른 키를 찾아서 표시
  const entry = chartData.find((item) => item.name === value)
  if (entry) {
    // name을 제외한 첫 번째 키를 찾아서 표시
    const dynamicKey = Object.keys(entry).find((key) => key !== 'name')
    if (dynamicKey) {
      const dynamicValue = entry[dynamicKey]
      // 숫자인 경우 포맷팅
      if (typeof dynamicValue === 'number') {
        // ChartData에서 unit과 scale 정보 가져오기
        if (isChartData) {
          const chartDataTyped = data as ChartData
          const series = chartDataTyped.series.find((s) => s.name === dynamicKey)
          if (series) {
            const unit = series.unit || ''
            const scale = series.scale || ''

            // scale에 따른 표시 형식
            let formattedValue = dynamicValue.toLocaleString()
            let displayText = formattedValue

            // scale과 unit 추가
            if (scale && unit) {
              displayText = `${formattedValue}${scale} ${unit}`
            } else if (scale) {
              displayText = `${formattedValue}${scale}`
            } else if (unit) {
              displayText = `${formattedValue} ${unit}`
            }

            return displayText
          }
        }

        // 기본 포맷팅 (ChartData가 아닌 경우)
        if (Math.abs(dynamicValue) >= 100000000) {
          return `${(dynamicValue / 100000000).toFixed(1)}억`
        } else if (Math.abs(dynamicValue) >= 10000) {
          return `${(dynamicValue / 10000).toFixed(1)}만`
        }
        return dynamicValue.toLocaleString()
      }
      return String(dynamicValue)
    }
  }
  return value
}

export const RechartsGraph = ({
  data,
  blockId,
  type,
  width = 684,
  height = 320,
  lines = [],
  bars = [],
  elements = [],
  colors = ['#FF6D65'],
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAnimationActive = true,
  responsive = false,
  strokeWidth = 2,
  lineColor = '#8884d8',
  areaColor = 'rgba(136, 132, 216, 0.3)',
  dotSize = 4,
  hideDots = false,
  showGrid = true,
  showBrush = false,
  referenceLines = [],
  referenceAreas = [],
  xAxisLabel,
  yAxisLabel,
  yAxisLabelRight,
  tooltipFormatter,
  legendFormatter,
  layout = 'horizontal',
  leftAxisTickFormatter,
  rightAxisTickFormatter,
  // 상단 여백을 충분히 주어 label들이 잘리지 않도록 합니다.
  margin = { top: 40, right: 10, left: 10, bottom: 40 },
}: ChartProps) => {
  // data가 ChartData 형태이면 true (metadata, axes, series 포함)
  const isChartData = data && !Array.isArray(data) && 'series' in data

  // ChartData가 전달된 경우, 추가 정보 추출
  let finalXAxisLabel = ''
  let finalLeftYAxisLabel = yAxisLabel
  let finalLeftYAxisUnit = ''
  let finalLeftYAxisScale = '' // scale 정보
  let finalRightYAxisLabel = yAxisLabelRight
  let finalRightYAxisUnit = ''
  let finalRightYAxisScale = '' // scale 정보
  let chartTitle = ''
  let finalLeftYAxisHidden = false
  let finalRightYAxisHidden = false

  if (isChartData) {
    const chartDataTyped = data as ChartData
    // X축 라벨
    finalXAxisLabel = chartDataTyped.axes.x.labelHidden ? '' : chartDataTyped.axes.x.label

    // 왼쪽 Y축: unit, scale, label
    finalLeftYAxisUnit = chartDataTyped.axes.y.primary.unit || ''
    finalLeftYAxisScale = chartDataTyped.axes.y.primary.scale || ''
    finalLeftYAxisLabel = chartDataTyped.axes.y.primary.label || ''
    finalLeftYAxisHidden = chartDataTyped.axes.y.primary.hidden || false

    // 오른쪽 Y축: unit, scale, label
    finalRightYAxisUnit = chartDataTyped.axes.y.secondary?.unit || ''
    finalRightYAxisScale = chartDataTyped.axes.y.secondary?.scale || ''
    finalRightYAxisLabel = chartDataTyped.axes.y.secondary?.label || ''
    finalRightYAxisHidden = chartDataTyped.axes.y.secondary?.hidden || false

    // 차트 타이틀 줄바꿈 처리
    chartTitle = chartDataTyped.metadata.title || ''
    // 차트 타이틀 줄바꿈/날짜 제거 처리
    // const rawTitle = chartDataTyped.metadata.title || ''
    chartTitle = chartTitle
      .replace(/(?:\s*\n)?\s*\(\s*\d{4}-\d{2}-\d{2}\s*[~\-–]\s*\d{4}-\d{2}-\d{2}\s*\)\s*$/, '')
      .trim()
    // const idx = chartTitle.indexOf('(')
    // if (idx !== -1) {
    //   chartTitle = chartTitle.substring(0, idx) + '\n' + chartTitle.substring(idx)
    // }
  }

  let chartElements = elements
  let chartData: ChartData | RechartsData = data

  if (isChartData && chartElements.length === 0) {
    const chartDataTyped = data as ChartData
    chartElements = chartDataTyped.series.map((series, index) => ({
      type: (series.type || type || 'line') as 'line' | 'bar' | 'area' | 'scatter',
      dataKey: series.name,
      name: series.name,
      yAxisId: series.yAxisId === 'secondary' ? 'right' : 'left',
      color: series.color || colors[index % colors.length],
      hideDots: true,
      strokeWidth: 1,
    }))

    chartData = chartDataTyped.series.reduce<RechartsData>((acc, series) => {
      series.data.forEach((point, idx) => {
        // if (!acc[idx]) {
        //   acc[idx] = { name: String(point.x) }
        // }
        let yValue: string | number = 0

        if (point.y === null || point.y === undefined) {
          yValue = 0
        } else if (typeof point.y === 'number' || typeof point.y === 'string') {
          yValue = point.y
        } else if (typeof point.y === 'object') {
          const numericValue = Object.values(point.y).find((v) => typeof v === 'number')
          if (numericValue !== undefined) {
            yValue = numericValue
          }
        }
        if (yValue !== 0) {
          if (!acc[idx]) {
            acc[idx] = { name: String(point.x) }
          }
          acc[idx][series.name] = yValue
        }
      })
      return acc
    }, [])
    chartData = chartData.filter((item) => {
      const keys = Object.keys(item).filter((key) => key !== 'name')
      return keys.length > 0
    })
  }

  if (
    (!Array.isArray(chartData) && !isChartData) ||
    (Array.isArray(chartData) && chartData.length === 0) ||
    chartElements.length === 0
  ) {
    return null
  }

  const hasRightAxis = chartElements.some((element) => element.yAxisId === 'right')

  // X축 tick 설정 계산
  const xAxisTickSettings = useMemo(() => {
    return getXAxisTickSettings(Array.isArray(chartData) ? chartData : [])
  }, [chartData])

  // Y축 도메인 계산 (양/음 혼합 데이터 처리)
  const { yMin, yMax } = useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) {
      return { yMin: undefined, yMax: undefined }
    }

    // bar 차트가 포함된 경우에만 도메인 계산
    const hasBarChart = chartElements.some((element) => element.type === 'bar')
    if (!hasBarChart) {
      return { yMin: undefined, yMax: undefined }
    }

    const allValues: number[] = []
    chartData.forEach((entry) => {
      chartElements.forEach((element) => {
        if (element.type === 'bar') {
          const value = entry[element.dataKey]
          if (typeof value === 'number' && !isNaN(value)) {
            allValues.push(value)
          }
        }
      })
    })

    if (allValues.length === 0) {
      return { yMin: undefined, yMax: undefined }
    }

    const minV = Math.min(...allValues)
    const maxV = Math.max(...allValues)

    // 모든 값이 양수인 경우
    if (minV >= 0) {
      const padUp = Math.max(1, Math.round(maxV * 0.1))
      return { yMin: 0, yMax: maxV + padUp }
    }

    // 모든 값이 음수인 경우
    if (maxV <= 0) {
      const padDown = Math.max(1, Math.round(Math.abs(minV) * 0.1))
      return { yMin: minV - padDown, yMax: 0 }
    }

    // 양/음 혼합인 경우
    const span = maxV - minV
    const pad = Math.max(1, Math.round(span * 0.08))
    return { yMin: minV - pad, yMax: maxV + pad }
  }, [chartData, chartElements])

  const renderChartElements = () => {
    return chartElements.map((element, index) => {
      const elementKey = `${element.type}-${element.dataKey}-${index}`
      const commonProps = {
        dataKey: element.dataKey,
        name: element.name || element.dataKey,
        yAxisId: element.yAxisId || 'left',
        isAnimationActive,
      }

      switch (element.type) {
        case 'line':
          return (
            <Line
              {...commonProps}
              type="monotone"
              key={elementKey}
              xAxisId="primary"
              yAxisId={'lineLeft'}
              stroke={'#FF6D65'}
              strokeWidth={1.4}
              dot={{
                r: (element as LineElement).dotSize || 3,
                strokeWidth: 1.4,
                stroke: '#FF6D65',
                fill: '#fff',
              }}
              activeDot={{ r: 5 }}
              isAnimationActive
              strokeDasharray={(element as LineElement).strokeDasharray}
            />
          )
        case 'bar':
          return (
            <Bar
              {...commonProps}
              key={elementKey}
              xAxisId="primary"
              yAxisId={'barLeft'}
              barSize={(element as BarElement).barSize || 14}
              radius={(element as BarElement).radius || [2, 2, 0, 0]}
              stackId={(element as BarElement).stackId}
              isAnimationActive={isAnimationActive}
              animationBegin={150}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {Array.isArray(chartData) &&
                chartData.map((entry, idx) => {
                  const value = entry[element.dataKey] as number
                  return (
                    <Cell
                      key={idx}
                      fill={(element as BarElement).fill || (value >= 0 ? '#E96C5F' : '#233269')}
                    />
                  )
                })}
            </Bar>
          )
        case 'stack_bar':
          return (
            <Bar
              {...commonProps}
              key={elementKey}
              xAxisId="primary"
              fill={
                (element as StackBarElement).fill || element.color || colors[index % colors.length]
              }
              barSize={(element as StackBarElement).barSize || 20}
              radius={(element as StackBarElement).radius || 0}
              stackId={(element as StackBarElement).stackId || 'stack'}
            />
          )
        case 'area':
          return (
            <Area
              {...commonProps}
              key={elementKey}
              xAxisId="primary"
              stroke={
                (element as AreaElement).stroke || element.color || colors[index % colors.length]
              }
              fill={(element as AreaElement).fill || element.color || colors[index % colors.length]}
              fillOpacity={(element as AreaElement).fillOpacity || 0.3}
              strokeWidth={(element as AreaElement).strokeWidth || 2}
            />
          )
        case 'scatter':
          return (
            <Scatter
              {...commonProps}
              key={elementKey}
              xAxisId="primary"
              fill={
                (element as ScatterElement).fill || element.color || colors[index % colors.length]
              }
              shape={(element as ScatterElement).shape || 'circle'}
            />
          )
        default:
          return null
      }
    })
  }

  const ChartComponent = (
    <RechartsComposedChart
      width={width}
      height={height}
      data={Array.isArray(chartData) ? chartData.slice(-7) : []}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      layout={layout}
      margin={margin}
    >
      {showGrid && <CartesianGrid stroke="#EAEAEA" />}

      {/* 첫 번째 XAxis: 기본 라벨 (날짜 등) */}
      <XAxis
        dataKey="name"
        xAxisId="primary"
        tick={{ fill: '#999', fontSize: 12, fontWeight: 600 }}
        tickMargin={16} // 여백을 늘려서 텍스트가 잘리지 않도록
        label={
          finalXAxisLabel
            ? { value: finalXAxisLabel, position: 'insideBottom', offset: -10 }
            : undefined
        }
        minTickGap={50} // 최소 간격을 늘려서 겹치지 않도록
        axisLine={false}
        tickLine={false}
        height={25}
        type="category"
        padding={{ left: 30, right: 30 }}
        interval={
          Array.isArray(chartData) && chartData.length > 5
            ? 2
            : Array.isArray(chartData) && chartData.length < 5
              ? 0
              : 1
        }
      />

      {/* 두 번째 XAxis: 동적 값 (금액 등) */}
      {Array.isArray(chartData) && chartData.length > 0 && (
        <XAxis
          dataKey="name"
          xAxisId="secondary"
          tick={{ fill: '#999', fontSize: 12, fontWeight: 600 }}
          tickMargin={16} // 여백을 늘려서 텍스트가 잘리지 않도록
          axisLine={false}
          tickLine={false}
          minTickGap={50}
          height={25}
          type="category"
          padding={{ left: 30, right: 30 }}
          interval={
            Array.isArray(chartData) && chartData.length > 5
              ? 2
              : Array.isArray(chartData) && chartData.length < 5
                ? 0
                : 1
          }
          tickFormatter={(value) => formatSecondaryAxisValue(value, chartData, data, isChartData)}
        />
      )}
      <YAxis yAxisId="lineLeft" hide={true} domain={['auto', 'auto']} />
      <YAxis
        yAxisId="barLeft"
        orientation="left"
        hide={true}
        domain={[
          (dataMin: number) =>
            dataMin >= 0
              ? 0 // 전부 양수면 아래쪽은 0
              : Math.floor(dataMin * (1 + 0.1)),
          (dataMax: number) => Math.ceil(dataMax * (1 + 0.1)), // 위쪽 패딩
        ]}
        tickCount={6}
        tickFormatter={(v) => v.toLocaleString()}
      />
      <YAxis yAxisId="right" orientation="right" hide />
      {/* 왼쪽 YAxis */}

      {/* <YAxis
        yAxisId="left"
        tick={{ fontSize: 14, fontWeight: 'bold' }}
        tickFormatter={leftAxisTickFormatter}
        hide={finalLeftYAxisHidden}
        domain={yMin !== undefined && yMax !== undefined ? [yMin, yMax] : undefined}
        tickCount={4}
      >
        {finalLeftYAxisUnit && (
          <Label
            value={finalLeftYAxisUnit}
            position="top"
            offset={30}
            style={{ textAnchor: 'middle', fontSize: 12 }}
          />
        )}

        {finalLeftYAxisScale && (
          <Label
            value={finalLeftYAxisScale}
            position="top"
            offset={15}
            style={{ textAnchor: 'middle', fontSize: 12 }}
          />
        )}

        {finalLeftYAxisLabel && (
          <Label
            value={finalLeftYAxisLabel}
            angle={-90}
            position="insideLeft"
            offset={0}
            style={{ textAnchor: 'middle', fontSize: 12 }}
          />
        )}
      </YAxis> */}

      {/* 오른쪽 YAxis */}
      {/* {hasRightAxis && (
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14, fontWeight: 'bold' }}
          tickFormatter={rightAxisTickFormatter}
          hide={finalRightYAxisHidden}
        >
          {finalRightYAxisUnit && (
            <Label
              value={finalRightYAxisUnit}
              position="top"
              offset={30}
              style={{ textAnchor: 'middle', fontSize: 12 }}
            />
          )}
          {finalRightYAxisScale && (
            <Label
              value={finalRightYAxisScale}
              position="top"
              offset={15}
              style={{ textAnchor: 'middle', fontSize: 12 }}
            />
          )}
          {finalRightYAxisLabel && (
            <Label
              value={finalRightYAxisLabel}
              angle={90}
              position="insideRight"
              offset={0}
              style={{ textAnchor: 'middle', fontSize: 12 }}
            />
          )}
        </YAxis>
      )} */}

      <Tooltip
        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
        contentStyle={{
          background: '#444444',
          border: '1px solid #444444',
          borderRadius: 8,
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        }}
        formatter={tooltipFormatter}
        content={
          isChartData ? (
            <CustomTooltip formatter={createTooltipFormatter(chartData as ChartData)} />
          ) : undefined
        }
        labelFormatter={(label) => label || ''}
      />

      {renderChartElements()}

      {/* y=0 기준선 (양/음 혼합 데이터일 때만 표시) */}
      {yMin !== undefined && yMax !== undefined && yMin < 0 && yMax > 0 && (
        <ReferenceLine y={0} stroke="#EAEAEA" xAxisId="primary" yAxisId="barLeft" />
      )}

      {referenceLines.map((line, index) => (
        <ReferenceLine
          key={index}
          x={line.x}
          y={line.y}
          label={line.label}
          stroke={line.color || '#666'}
          xAxisId="primary"
          yAxisId="barLeft"
        />
      ))}

      {referenceAreas.map((area, index) => (
        <ReferenceArea
          key={index}
          x1={area.x1}
          x2={area.x2}
          y1={area.y1}
          y2={area.y2}
          fill={area.fill || 'rgba(102, 102, 102, 0.3)'}
          label={area.label}
        />
      ))}

      {showBrush && <Brush />}
    </RechartsComposedChart>
  )

  return (
    <div className="w-full">
      {chartTitle && (
        <div
          style={{
            textAlign: 'center',
            whiteSpace: 'pre-line',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%',
            lineHeight: '12px',
          }}
        >
          {chartTitle}
        </div>
      )}
      {responsive ? (
        <ResponsiveContainer width="100%" height={height}>
          {ChartComponent}
        </ResponsiveContainer>
      ) : (
        <div className="w-full flex justify-center">{ChartComponent}</div>
      )}
    </div>
  )
}

export default React.memo<typeof RechartsGraph>(RechartsGraph)
