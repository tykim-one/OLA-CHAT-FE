'use client'

import React from 'react'

import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface LineChartProps {
  data: Array<{
    name: string
    [key: string]: any
  }>
  width?: number
  height?: number
  lines?: Array<{
    dataKey: string
    color?: string
    yAxisId?: 'left' | 'right'
  }>
  onClick?: (data: any) => void
  onMouseEnter?: (data: any) => void
  onMouseLeave?: () => void
  isAnimationActive?: boolean
  responsive?: boolean
  strokeWidth?: number
  showGrid?: boolean
  lineColor?: string
  areaColor?: string
  showBrush?: boolean
  dotSize?: number
  hideDots?: boolean
  referenceLines?: Array<{
    y?: number
    x?: string | number
    label?: string
    color?: string
  }>
  referenceAreas?: Array<{
    x1: string | number
    x2: string | number
    fill?: string
    label?: string
  }>
  xAxisLabel?: string
  yAxisLabel?: string
  yAxisLabelRight?: string
  tooltipFormatter?: (value: any) => string
  legendFormatter?: (value: string) => string
}

export const LineChart = ({
  data,
  width = 400,
  height = 400,
  lines = [],
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAnimationActive = true,
  responsive = false,
  strokeWidth = 2,
  showGrid = true,
  lineColor = '#8884d8',
  areaColor = 'rgba(136, 132, 216, 0.3)',
  showBrush = false,
  dotSize = 4,
  hideDots = false,
  referenceLines = [],
  referenceAreas = [],
  xAxisLabel,
  yAxisLabel,
  yAxisLabelRight,
  tooltipFormatter,
  legendFormatter,
}: LineChartProps) => {
  if (!data || data.length === 0) {
    return null
  }

  // 이중 Y축 사용 여부 확인
  const hasRightAxis = lines.some((line) => line.yAxisId === 'right')

  const Chart = (
    <RechartsChart
      data={data}
      width={width}
      height={height}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis
        dataKey="name"
        tick={{ fontSize: 12 }}
        angle={15}
        tickMargin={15}
        // label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
      />
      <YAxis
        yAxisId="left"
        tick={{ fontSize: 14, fontWeight: 'bold' }}
        label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        tickFormatter={(value: number) => `${(value / 1000000).toFixed(1)}M`}
      />
      {hasRightAxis && (
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14, fontWeight: 'bold' }}
          label={{ value: yAxisLabelRight, angle: 90, position: 'insideRight' }}
          tickFormatter={(value: number) => `${(value / 1000).toFixed(1)}K`}
        />
      )}
      <Tooltip contentStyle={{ fontSize: 14, fontWeight: 'bold' }} />
      <Legend wrapperStyle={{ fontSize: 14, fontWeight: 'bold', bottom: -5 }} />

      {lines.length > 0 ? (
        lines.map((line, index) => (
          <Line
            key={line.dataKey}
            dataKey={line.dataKey}
            stroke={line.color || lineColor}
            strokeWidth={strokeWidth}
            isAnimationActive={isAnimationActive}
            dot={!hideDots ? { r: dotSize } : false}
            yAxisId={line.yAxisId || 'left'}
          />
        ))
      ) : (
        <Line
          dataKey="value"
          stroke={lineColor}
          strokeWidth={strokeWidth}
          isAnimationActive={isAnimationActive}
          dot={!hideDots ? { r: dotSize } : false}
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

export default LineChart
