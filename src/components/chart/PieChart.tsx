'use client'

import React from 'react'

import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart as RechartsChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'

export interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  width?: number
  height?: number
  colors?: string[]
  onClick?: (data: any) => void
  onMouseEnter?: (data: any) => void
  onMouseLeave?: () => void
  isAnimationActive?: boolean
  responsive?: boolean
  innerRadius?: number
  outerRadius?: number
  labelLine?: boolean
  activeIndex?: number
  showPercentage?: boolean
  centerLabel?: string
  tooltipFormatter?: (value: any, name: string) => string
  legendFormatter?: (value: string) => string
  customLabel?: (props: any) => React.ReactNode
  activeShape?: (props: any) => React.ReactNode
  variant?: 'default' | 'needle' | 'gauge' | 'radial'
  startAngle?: number
  endAngle?: number
  needleValue?: number
  needleColor?: string
  gaugeValue?: number
  minValue?: number
  maxValue?: number
  thresholds?: Array<{
    value: number
    color: string
  }>
  blockId?: string
}

// 새로운 색상 팔레트
const DEFAULT_COLORS = [
  '#003f5c',
  '#58508d',
  '#bc5090',
  '#ff6361',
  '#ffa600',
  '#2a5d78',
  '#7e609f',
  '#d16ea2',
]

const renderNeedle = (
  cx: number,
  cy: number,
  value: number,
  minValue: number,
  maxValue: number,
  length: number,
  color: string,
) => {
  const rotation = 180 * ((value - minValue) / (maxValue - minValue))
  const angle = (rotation - 90) * (Math.PI / 180)
  const x2 = cx + length * Math.cos(angle)
  const y2 = cy + length * Math.sin(angle)

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props

  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.name}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Value: ${value})`}
      </text>
    </g>
  )
}

export const PieChart = ({
  data,
  width = 400,
  height = 400,
  colors = DEFAULT_COLORS,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAnimationActive = true,
  responsive = false,
  innerRadius = 0,
  outerRadius = 150,
  labelLine = false,
  activeIndex,
  showPercentage = false,
  centerLabel,
  tooltipFormatter,
  legendFormatter,
  customLabel,
  activeShape = renderActiveShape,
  variant = 'default',
  startAngle = 0,
  endAngle = 360,
  needleValue,
  needleColor = '#666',
  gaugeValue,
  minValue = 0,
  maxValue = 100,
  thresholds = [],
}: PieChartProps) => {
  if (!data || data.length === 0) {
    return null
  }

  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  const renderLabel = (props: any) => {
    if (customLabel) {
      return customLabel(props)
    }
    const { name, value, percent } = props
    return (
      <text style={{ fontSize: 14, fontWeight: 'bold' }}>
        {showPercentage ? `${name}: ${(percent * 100).toFixed(1)}%` : `${name}: ${value}`}
      </text>
    )
  }

  const renderGauge = () => {
    const value = gaugeValue ?? 0
    const normalizedValue = Math.min(Math.max(value, minValue), maxValue)
    const percentage = ((normalizedValue - minValue) / (maxValue - minValue)) * 100

    let color = colors[0]
    if (thresholds.length > 0) {
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value >= thresholds[i].value) {
          color = thresholds[i].color
          break
        }
      }
    }

    return (
      <RechartsChart width={width} height={height}>
        <Pie
          data={[{ value: percentage }, { value: 100 - percentage }]}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#f3f3f3"
          dataKey="value"
          isAnimationActive={isAnimationActive}
        >
          <Cell fill={color} />
          <Cell fill="#f3f3f3" />
          <Label
            value={`${value.toFixed(0)}%`}
            position="center"
            fill="#666"
            style={{ fontSize: '24px' }}
          />
        </Pie>
      </RechartsChart>
    )
  }

  const renderChart = () => {
    if (variant === 'gauge') {
      return renderGauge()
    }

    const chart = (
      <RechartsChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={labelLine}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          isAnimationActive={isAnimationActive}
          activeIndex={activeIndex}
          // activeShape={activeShape}
          // label={renderLabel}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              style={{
                filter: activeIndex === index ? 'brightness(1.1)' : undefined,
                cursor: 'pointer',
              }}
            />
          ))}
          {centerLabel && (
            <Label
              content={({ viewBox }) => {
                if (!viewBox) return null
                const { cx = 0, cy = 0 } = viewBox as { cx: number; cy: number }
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: 14, fontWeight: 'bold' }}
                  >
                    {centerLabel}
                  </text>
                )
              }}
            />
          )}
        </Pie>
        {variant === 'needle' && needleValue !== undefined && (
          <Label
            content={({ viewBox }) => {
              if (!viewBox) return null
              const { cx = 0, cy = 0 } = viewBox as { cx: number; cy: number }
              return renderNeedle(
                cx,
                cy,
                needleValue,
                minValue,
                maxValue,
                outerRadius - 20,
                needleColor,
              )
            }}
          />
        )}
        <Tooltip formatter={tooltipFormatter} contentStyle={{ fontSize: 14, fontWeight: 'bold' }} />
        {/* <Legend formatter={legendFormatter} wrapperStyle={{ fontSize: 14, fontWeight: 'bold' }} /> */}
      </RechartsChart>
    )

    return chart
  }

  if (responsive) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    )
  }

  return renderChart()
}

export default PieChart
