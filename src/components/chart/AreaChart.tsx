'use client'

import React from 'react'

import {
  Area,
  Brush,
  CartesianGrid,
  Label,
  Legend,
  AreaChart as RechartsChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface AreaChartProps {
  data: Array<{
    name: string
    value: number
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
  areaColor?: string
  gradientColors?: {
    start: string
    end: string
  }
  showBrush?: boolean
  dotSize?: number
  hideDots?: boolean
  stackedAreas?: Array<{
    dataKey: string
    color?: string
    gradientColors?: {
      start: string
      end: string
    }
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
  tooltipFormatter?: (value: any) => string
  legendFormatter?: (value: string) => string
  curve?: 'linear' | 'natural' | 'basis' | 'monotone'
  variant?: 'default' | 'stacked' | 'percent'
}

export const AreaChart = ({
  data,
  width = 400,
  height = 400,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAnimationActive = true,
  responsive = false,
  strokeWidth = 2,
  showGrid = true,
  areaColor = '#8884d8',
  gradientColors,
  showBrush = false,
  dotSize = 4,
  hideDots = false,
  stackedAreas = [],
  referenceLines = [],
  referenceAreas = [],
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter,
  legendFormatter,
  curve = 'monotone',
  variant = 'default',
}: AreaChartProps) => {
  if (!data || data.length === 0) {
    return null
  }

  const renderGradientDefs = () => {
    const defs = []

    if (gradientColors) {
      defs.push(
        <defs key="mainGradient">
          <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColors.start} stopOpacity={0.8} />
            <stop offset="95%" stopColor={gradientColors.end} stopOpacity={0.2} />
          </linearGradient>
        </defs>,
      )
    }

    stackedAreas.forEach((area, index) => {
      if (area.gradientColors) {
        defs.push(
          <defs key={`gradient-${index}`}>
            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.gradientColors.start} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.gradientColors.end} stopOpacity={0.2} />
            </linearGradient>
          </defs>,
        )
      }
    })

    return defs
  }

  const renderChart = () => (
    <RechartsChart
      width={width}
      height={height}
      data={data}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderGradientDefs()}
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis
        dataKey="name"
        label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined}
      />
      <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left' } : undefined} />
      <Tooltip formatter={tooltipFormatter} />
      <Legend formatter={legendFormatter} />

      {referenceLines.map((line, index) => (
        <ReferenceLine
          key={index}
          y={line.y}
          x={line.x}
          label={line.label}
          stroke={line.color || '#666'}
          strokeDasharray="3 3"
        />
      ))}

      {referenceAreas.map((area, index) => (
        <ReferenceArea
          key={index}
          x1={area.x1}
          x2={area.x2}
          y1={area.y1}
          y2={area.y2}
          fill={area.fill || 'rgba(200, 200, 200, 0.2)'}
          label={area.label}
        />
      ))}

      {variant === 'default' && (
        <Area
          type={curve}
          dataKey="value"
          stroke={areaColor}
          strokeWidth={strokeWidth}
          fill={gradientColors ? 'url(#mainGradient)' : areaColor}
          fillOpacity={0.3}
          isAnimationActive={isAnimationActive}
          dot={hideDots ? false : { r: dotSize }}
          activeDot={{ r: dotSize + 2 }}
        />
      )}

      {(variant === 'stacked' || variant === 'percent') &&
        stackedAreas.map((area, index) => (
          <Area
            key={area.dataKey}
            type={curve}
            dataKey={area.dataKey}
            stroke={area.color || areaColor}
            strokeWidth={strokeWidth}
            fill={area.gradientColors ? `url(#gradient-${index})` : area.color || areaColor}
            fillOpacity={0.3}
            isAnimationActive={isAnimationActive}
            dot={hideDots ? false : { r: dotSize }}
            activeDot={{ r: dotSize + 2 }}
            stackId={variant === 'stacked' ? 'stack' : 'percent'}
          />
        ))}

      {showBrush && (
        <Brush dataKey="name" height={30} stroke={areaColor} fill="#fff" y={height - 30} />
      )}
    </RechartsChart>
  )

  if (responsive) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    )
  }

  return renderChart()
}

export default AreaChart
