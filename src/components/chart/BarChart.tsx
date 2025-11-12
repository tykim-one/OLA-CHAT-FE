'use client'

import React from 'react'

import {
  Bar,
  Brush,
  CartesianGrid,
  Label,
  Legend,
  BarChart as RechartsChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface BarChartProps {
  data: Array<{
    name: string
    [key: string]: any
  }>
  width?: number
  height?: number
  onClick?: (data: any) => void
  onMouseEnter?: (data: any) => void
  onMouseLeave?: () => void
  isAnimationActive?: boolean
  responsive?: boolean
  strokeWidth?: number
  showGrid?: boolean
  barColor?: string
  showBrush?: boolean
  barSize?: number
  bars?: Array<{
    dataKey: string
    color?: string
    yAxisId?: 'left' | 'right'
  }>
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
  tooltipFormatter?: (value: any) => string
  legendFormatter?: (value: string) => string
  variant?: 'default' | 'grouped' | 'stacked'
  radius?: number | [number, number, number, number]
  layout?: 'horizontal' | 'vertical'
  blockId?: string
}

export const BarChart = ({
  data,
  width = 400,
  height = 400,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAnimationActive = true,
  responsive = false,
  strokeWidth = 1,
  showGrid = true,
  barColor,
  showBrush = false,
  barSize = 20,
  bars = [],
  referenceLines = [],
  referenceAreas = [],
  xAxisLabel,
  yAxisLabel,
  yAxisLabelRight,
  tooltipFormatter,
  legendFormatter,
  variant = 'default',
  radius = 0,
  layout = 'horizontal',
}: BarChartProps) => {
  if (!data || data.length === 0) {
    return null
  }

  // 이중 Y축 사용 여부 확인
  const hasRightAxis = bars.some((bar) => bar.yAxisId === 'right')

  const Chart = (
    <RechartsChart
      width={width}
      height={height}
      data={data}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      layout={layout}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis
        dataKey="name"
        tick={{ fontSize: 14, fontWeight: 'bold' }}
        label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined}
      />
      <YAxis
        yAxisId="left"
        tick={{ fontSize: 14, fontWeight: 'bold' }}
        label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left' } : undefined}
      />
      {hasRightAxis && (
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14, fontWeight: 'bold' }}
          label={
            yAxisLabelRight ? { value: yAxisLabelRight, angle: 90, position: 'right' } : undefined
          }
        />
      )}
      <Tooltip formatter={tooltipFormatter} contentStyle={{ fontSize: 14, fontWeight: 'bold' }} />
      <Legend formatter={legendFormatter} wrapperStyle={{ fontSize: 14, fontWeight: 'bold' }} />

      {bars.length > 0 ? (
        bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color || barColor}
            strokeWidth={strokeWidth}
            isAnimationActive={isAnimationActive}
            barSize={barSize}
            radius={radius}
            yAxisId={bar.yAxisId || 'left'}
          />
        ))
      ) : (
        <Bar
          dataKey="value"
          fill={barColor}
          strokeWidth={strokeWidth}
          isAnimationActive={isAnimationActive}
          barSize={barSize}
          radius={radius}
          yAxisId="left"
        />
      )}

      {referenceLines.map((line, index) => (
        <ReferenceLine
          key={index}
          x={line.x}
          y={line.y}
          label={line.label}
          stroke={line.color || '#666'}
        />
      ))}

      {referenceAreas.map((area, index) => (
        <ReferenceArea
          key={index}
          x1={area.x1}
          x2={area.x2}
          y1={area.y1}
          y2={area.y2}
          fill={area.fill || '#666'}
          label={area.label}
        />
      ))}

      {showBrush && <Brush />}
    </RechartsChart>
  )

  return responsive ? (
    <ResponsiveContainer width="100%" height={height}>
      {Chart}
    </ResponsiveContainer>
  ) : (
    Chart
  )
}

export default BarChart
