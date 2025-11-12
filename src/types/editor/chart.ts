import dayjs from 'dayjs'
import { clone, pick } from 'ramda'

import { renderChartDefaultMetaByKey } from '@/constants/editor/chartPresets'

import { AssetModel, TimeFrameKey, TimeOptionValue } from './common'

import {
  DataSetField,
  DataSetSelectAggregation,
  DataSetGroupByCondition,
  DataSetFilterCondition,
  DataSetModel,
  DataSetQueryModel,
  DataSetSortCondition,
  DataSetType,
  VisualizationType,
} from '../dataset'

export type ChartVisualizationKey = 'LINE_CHART' | 'BAR_CHART' | 'PIE_CHART' | 'CANDLESTICK_CHART'

export type ChartPresetKey =
  | 'PRICE_INFORMATION'
  | 'MAJOR_STOCK_INDEX_PERFORMANCE'
  | 'AGENT_STOCK_INDEX_PERFORMANCE'
  | 'ADVANCED_VALUATION_AND_EFFICIENCY_METRICS'
  | 'PRICE_AND_DIVIDEND_CHART'
  | 'VALUATION_MULTIPLES_CHART'
  | 'VALUATION_MULTIPLES'
  | 'YIELDS_AND_CAPEX_RATIOS'
  | 'INCOME_STATEMENT_TRENDS'
  | 'CASH_FLOW_STATEMENT_VISUALIZATION'
  | 'MARGINS_AND_RETURNS'
  | 'BALANCE_SHEET_HIGHLIGHTS'
  | 'ETF_WEIGHTS'
  | 'NONE'

export type ChartOptionGroupKey =
  | 'DATE_RANGE'
  | 'FINANCIAL_PERIOD'
  | 'DATE_RANGE_ANNUAL'
  | 'DATE_RANGE_QUARTERLY'
  | 'TIME_FRAME'
  | 'FINANCIAL_METRIC'
  | 'VALUATION_METRIC'

export type ChartTabKey = 'RENDER' | 'OPTION'

export type ChartOptionValueModel = {
  chartPresetType: ChartPresetKey
  visualizationType: ChartVisualizationKey
  invisibleTabs?: ChartTabKey[]
  referenceTime: number
  s: string //sessionId
  options: Partial<{
    [optionGroup in ChartOptionGroupKey]: {
      id?: number
      planId?: number
      value: any
      cost?: number
    }
  }>
}

export type ChartOptionValues = {
  [k in ChartPresetKey]: ChartOptionValueModel
}

export type ChartLibType = 'tradingview' | 'recharts'
export type RenderChartComponentType =
  | ['tradingview', ['line', 'bar']]
  | ['tradingview', ['candlestick', 'bar']]
  | ['recharts', ['line']]
  | ['recharts', ['line', 'bar']]
  | ['recharts', ['bar']]
  | ['recharts', ['pie']]
  | ['recharts', ['stack_bar']]

export type RenderChartModel = AssetModel & {
  meta: ChartOptionValueModel
} & {
  chartContent: DataSetModel | null
}

export type ChartComponentHandle = {
  getChartCanvas: () => Promise<HTMLCanvasElement> | null
}

export const createRenderChartModel = ({
  chartPresetKey,
  ticker,
  market,
  name,
  chartContent,
  options,
}: {
  chartPresetKey: ChartPresetKey
  ticker: string
  market: string
  name: string
  chartContent?: DataSetModel
  options?: {
    [optionGroup in ChartOptionGroupKey]: {
      id?: number
      planId?: number
      value: any
      cost?: number
    }
  }
}): RenderChartModel | null => {
  const target = {
    id: '',
    name: name,
    ticker: ticker,
    country: market,
  }
  const referenceTime = dayjs().subtract(1, 'day').endOf('day').valueOf()

  if (chartContent) {
    return {
      chartContent: chartContent,
      meta: {
        chartPresetType: chartPresetKey,
        visualizationType: 'PIE_CHART',
        options: {},
        referenceTime: referenceTime,
        s: '',
      },
      target: target,
    }
  }
  switch (chartPresetKey) {
    case 'PRICE_INFORMATION':
      return {
        chartContent: null,
        meta: {
          chartPresetType: chartPresetKey,
          visualizationType: 'CANDLESTICK_CHART',
          options: {
            ...options,
            DATE_RANGE: {
              value: '3y',
            },
          },
          referenceTime: referenceTime,
          s: '',
        },
        target: target,
      }
    case 'PRICE_AND_DIVIDEND_CHART':
      return {
        chartContent: null,
        meta: {
          chartPresetType: chartPresetKey,
          visualizationType: 'LINE_CHART',
          options: {
            DATE_RANGE: {
              value: '10y',
            },
          },
          referenceTime: referenceTime,
          s: '',
        },
        target: target,
      }
    case 'INCOME_STATEMENT_TRENDS':
      return {
        chartContent: null,
        meta: {
          chartPresetType: chartPresetKey,
          visualizationType: 'BAR_CHART',
          options: {
            DATE_RANGE_ANNUAL: {
              value: '5y',
            },
          },
          referenceTime: referenceTime,
          s: '',
        },
        target: target,
      }
    case 'VALUATION_MULTIPLES_CHART':
      return {
        chartContent: null,
        meta: {
          chartPresetType: chartPresetKey,
          visualizationType: 'LINE_CHART',
          options: {
            DATE_RANGE_ANNUAL: {
              value: '5y',
            },
          },
          referenceTime: referenceTime,
          s: '',
        },
        target: target,
      }
    default:
      return null
  }
}

export const toVisualizationType = (chartVisualizationKey: ChartVisualizationKey) => {
  const visualizationTypeMap: { [k in ChartVisualizationKey]: VisualizationType } = {
    LINE_CHART: 'line',
    BAR_CHART: 'bar',
    PIE_CHART: 'pie',
    CANDLESTICK_CHART: 'candlestick',
  }

  return visualizationTypeMap[chartVisualizationKey] || ''
}

export const toDataSetType = (chartPresetKey: ChartPresetKey): DataSetType => {
  const dataSetTypeMap: { [k in ChartPresetKey]: DataSetType } = {
    PRICE_INFORMATION: 'Price',
    MAJOR_STOCK_INDEX_PERFORMANCE: 'Price',
    AGENT_STOCK_INDEX_PERFORMANCE: 'Price',
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: 'Finance',
    PRICE_AND_DIVIDEND_CHART: 'Price',
    VALUATION_MULTIPLES: 'Finance',
    VALUATION_MULTIPLES_CHART: 'Finance',
    INCOME_STATEMENT_TRENDS: 'Finance',
    CASH_FLOW_STATEMENT_VISUALIZATION: 'Finance',
    MARGINS_AND_RETURNS: 'Finance',
    BALANCE_SHEET_HIGHLIGHTS: 'Finance',
    YIELDS_AND_CAPEX_RATIOS: 'Finance',
    ETF_WEIGHTS: 'None',
    NONE: 'None',
  }

  return dataSetTypeMap[chartPresetKey] || ''
}

export const toSelectFields = ({ meta } :TransformChartOptionToDataSetQueryArgs): DataSetField[] => {
  const { chartPresetType, options } = meta

  const dataSetFieldsMap: { [k in ChartPresetKey]: DataSetField[] } = {
    PRICE_INFORMATION: [
      'ticker',
      'date',
      'close',
    ] as const,
    MAJOR_STOCK_INDEX_PERFORMANCE: [
      'ticker',
      'date',
      'open',
      'high',
      'low',
      'close',
      'volume',
    ] as const,
    AGENT_STOCK_INDEX_PERFORMANCE: [
      'ticker',
      'date',
      'open',
      'high',
      'low',
      'close',
      'volume',
    ] as const,
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'evToSales',
      'evToOperatingCashFlow',
      'evToEBITDA',
      'earningsYield',
      'freeCashFlowYield',
      'capexToOperatingCashFlow',
      'capexToDepreciation',
    ] as const,
    PRICE_AND_DIVIDEND_CHART: ['ticker', 'date', 'close', 'dividend'] as const,
    VALUATION_MULTIPLES_CHART: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      options.VALUATION_METRIC?.value,
      // 'peRatio',
      // 'pbRatio',
    ] as const,
    VALUATION_MULTIPLES: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'evToSales',
      'evToOperatingCashFlow',
      'evToFreeCashFlow',
      'evToEBITDA',
    ],
    INCOME_STATEMENT_TRENDS: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      options.FINANCIAL_METRIC?.value,
    ],
    CASH_FLOW_STATEMENT_VISUALIZATION: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'operatingCashFlow',
      'freeCashFlow',
      'growthOperatingCashFlow',
      'growthFreeCashFlow',
    ],
    MARGINS_AND_RETURNS: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'grossProfitMargin',
      'operatingProfitMargin',
      'netProfitMargin',
      'assetTurnover',
      'returnOnAssets',
      'ebitdaMargin',
    ],
    BALANCE_SHEET_HIGHLIGHTS: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'totalAssets',
      'totalLiabilities',
      'totalEquity',
      'debtToEquity',
    ],
    YIELDS_AND_CAPEX_RATIOS: [
      'ticker',
      'bsDate',
      'fiscalYear',
      'period',
      'earningsYield',
      'freeCashFlowYield',
      'capexToOperatingCashFlow',
      'returnOnInvestedCapital',
    ],
    ETF_WEIGHTS: [],
    NONE: [],
  }

  return dataSetFieldsMap[chartPresetType] || ([] as const)
}

export const toSelectAggregations = (chartPresetKey: ChartPresetKey): DataSetSelectAggregation<DataSetField>[] => {
  const dataSetAggregationsMap: { [k in ChartPresetKey]: DataSetSelectAggregation<DataSetField>[] } = {
    PRICE_INFORMATION: [
      {
        field: 'date',
        aggregationFunction: 'min'
      }
    ],
    MAJOR_STOCK_INDEX_PERFORMANCE: [],
    AGENT_STOCK_INDEX_PERFORMANCE: [],
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: [],
    PRICE_AND_DIVIDEND_CHART: [],
    VALUATION_MULTIPLES_CHART: [],
    VALUATION_MULTIPLES: [],
    INCOME_STATEMENT_TRENDS: [],
    CASH_FLOW_STATEMENT_VISUALIZATION: [],
    MARGINS_AND_RETURNS: [],
    BALANCE_SHEET_HIGHLIGHTS: [],
    YIELDS_AND_CAPEX_RATIOS: [],
    ETF_WEIGHTS: [],
    NONE: [],
  }

  return dataSetAggregationsMap[chartPresetKey] || ([] as const)
}

export const toGroupByConditions = (chartPresetKey: ChartPresetKey, aggregationType?: DataSetGroupByCondition['aggregationType']): DataSetGroupByCondition<DataSetField>[] => {
  const dataSetGroupByConditionsMap: { [k in ChartPresetKey]: DataSetGroupByCondition<DataSetField>[] } = {
    PRICE_INFORMATION: [
      {
        field: 'date',
        aggregationType: aggregationType || 'day'
      }
    ],
    MAJOR_STOCK_INDEX_PERFORMANCE: [],
    AGENT_STOCK_INDEX_PERFORMANCE: [],  
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: [],
    PRICE_AND_DIVIDEND_CHART: [],
    VALUATION_MULTIPLES_CHART: [],
    VALUATION_MULTIPLES: [],
    INCOME_STATEMENT_TRENDS: [],
    CASH_FLOW_STATEMENT_VISUALIZATION: [],
    MARGINS_AND_RETURNS: [],
    BALANCE_SHEET_HIGHLIGHTS: [],
    YIELDS_AND_CAPEX_RATIOS: [],
    ETF_WEIGHTS: [],
    NONE: [],
  }

  return dataSetGroupByConditionsMap[chartPresetKey] || ([] as const)
}

type ToDateTimeRangeOptions = {
  dateTimeFormat?: string
  referenceTime?: number
}
export const toDateTimeRanges = (
  time: TimeOptionValue,
  { dateTimeFormat = 'YYYYMMDD', referenceTime = dayjs().subtract(1, 'day').endOf('day').valueOf() }: ToDateTimeRangeOptions = {},
): [string, string] => {
  if (!time) return ['', '']

  const refer = dayjs(referenceTime)
  const to = refer.format(dateTimeFormat)

  // time이 지정된 TimeFrame일때 처리
  if (typeof time === 'string') {
    const timeFrameMap: Partial<{ [k in TimeFrameKey]: [string, string] }> = {
      '1d': [refer.subtract(1, 'day').format(dateTimeFormat), to],
      '3d': [refer.subtract(3, 'day').format(dateTimeFormat), to],
      '1w': [refer.subtract(1, 'week').format(dateTimeFormat), to],
      '1M': [refer.subtract(1, 'month').format(dateTimeFormat), to],
      '3M': [refer.subtract(3, 'month').format(dateTimeFormat), to],
      '6M': [refer.subtract(6, 'month').format(dateTimeFormat), to],
      '1y': [refer.subtract(1, 'year').format(dateTimeFormat), to],
      '3y': [refer.subtract(3, 'year').format(dateTimeFormat), to],
      '5y': [refer.subtract(5, 'year').format(dateTimeFormat), to],
      '10y': [refer.subtract(10, 'year').format(dateTimeFormat), to],
      QUARTERLY: [refer.subtract(3, 'month').format(dateTimeFormat), to],
      HALF_YEAR: [refer.subtract(6, 'month').format(dateTimeFormat), to],
      ANNUAL: [refer.subtract(1, 'year').format(dateTimeFormat), to],
    }

    return (timeFrameMap[time] || []) as [string, string]
  }

  // time이 지정된 TimeRange일때 처리
  const times = [time.from, time.to]
  const allTimesValid = times.every((time) => typeof time === 'string')
  if (allTimesValid) {
    return times.map((time) => dayjs(time).format(dateTimeFormat)) as [string, string]
  }

  return ['', ''] as [string, string]
}

export const toTitle = (chartPresetKey: ChartPresetKey): string => {
  const titleMap: { [k in ChartPresetKey]: string } = {
    PRICE_INFORMATION: 'Price Information',
    MAJOR_STOCK_INDEX_PERFORMANCE: 'Major Stock Index Performance',
    AGENT_STOCK_INDEX_PERFORMANCE: 'Index Performance',
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: 'Advanced Valuation & Efficiency Metrics',
    PRICE_AND_DIVIDEND_CHART: 'Price & Dividend Chart',
    VALUATION_MULTIPLES_CHART: 'Valuation Multiples Chart',
    VALUATION_MULTIPLES: 'Valuation Multiples',
    INCOME_STATEMENT_TRENDS: 'Income Statement Trends',
    CASH_FLOW_STATEMENT_VISUALIZATION: 'Cash Flow Statement Visualization',
    MARGINS_AND_RETURNS: 'Margins & Returns',
    BALANCE_SHEET_HIGHLIGHTS: 'Balance Sheet Highlights',
    YIELDS_AND_CAPEX_RATIOS: 'Yields and Capex Ratios',
    ETF_WEIGHTS: 'None',
    NONE: 'NONE',
  }

  return titleMap[chartPresetKey] || ''
}

export const toFilterConditions = ({
  meta,
  target,
}: TransformChartOptionToDataSetQueryArgs): DataSetFilterCondition<DataSetField>[] => {
  const { chartPresetType } = meta

  switch (chartPresetType) {
    case 'MAJOR_STOCK_INDEX_PERFORMANCE':
      return [
        { field: 'ticker', operator: 'in', value: ['^DJI', '^SPX', '^IXIC'] },
        {
          field: 'date',
          operator: 'between',
          value: toDateTimeRanges(meta.options.DATE_RANGE?.value, {
            referenceTime: meta.referenceTime,
          }),
        },
      ]
    case 'AGENT_STOCK_INDEX_PERFORMANCE':
      return [
        { field: 'ticker', operator: 'eq', value: target.ticker },
        {
          field: 'date',
          operator: 'between',
          value: toDateTimeRanges(meta.options.DATE_RANGE?.value, {
            referenceTime: meta.referenceTime,
          }),
        },
      ]

    case 'PRICE_INFORMATION':
    case 'PRICE_AND_DIVIDEND_CHART':
      return [
        { field: 'ticker', operator: 'eq', value: target.ticker },
        {
          field: 'date',
          operator: 'between',
          value: toDateTimeRanges(meta.options.DATE_RANGE?.value, {
            referenceTime: meta.referenceTime,
          }),
        },
      ]
    case 'ADVANCED_VALUATION_AND_EFFICIENCY_METRICS':
    case 'VALUATION_MULTIPLES_CHART':
    case 'VALUATION_MULTIPLES':
    case 'BALANCE_SHEET_HIGHLIGHTS':
    case 'CASH_FLOW_STATEMENT_VISUALIZATION':
    case 'INCOME_STATEMENT_TRENDS':
    case 'YIELDS_AND_CAPEX_RATIOS':
    case 'MARGINS_AND_RETURNS':
      return [
        { field: 'ticker', operator: 'eq', value: target.ticker },
        {
          field: 'bsDate',
          operator: 'between',
          value: toDateTimeRanges(
            meta.options.DATE_RANGE_ANNUAL?.value || meta.options.DATE_RANGE_QUARTERLY?.value,
            { referenceTime: meta.referenceTime },
          ),
        },
        {
          field: 'period',
          operator: 'in',
          value: meta.options.DATE_RANGE_ANNUAL?.value
            ? ['FY']
            : meta.options.DATE_RANGE_QUARTERLY?.value
              ? ['Q1', 'Q2', 'Q3', 'Q4']
              : [],
        },
      ]
    default:
      return []
  }
}

export const toSortConditions = ({
  meta,
}: TransformChartOptionToDataSetQueryArgs): DataSetSortCondition<DataSetField>[] => {
  const { chartPresetType } = meta

  const dateBaseSorter: DataSetSortCondition<DataSetField>[] = [
    {
      field: 'date',
      order: 'asc',
    },
  ]

  const financeBaseSorter: DataSetSortCondition<DataSetField>[] = [
    {
      field: 'bsDate',
      order: 'asc',
    },
  ]

  switch (chartPresetType) {
    case 'PRICE_INFORMATION':
    case 'MAJOR_STOCK_INDEX_PERFORMANCE':
    case 'PRICE_AND_DIVIDEND_CHART':
      return dateBaseSorter
    case 'ADVANCED_VALUATION_AND_EFFICIENCY_METRICS':
    case 'BALANCE_SHEET_HIGHLIGHTS':
    case 'CASH_FLOW_STATEMENT_VISUALIZATION':
    case 'INCOME_STATEMENT_TRENDS':
    case 'VALUATION_MULTIPLES_CHART':
    case 'VALUATION_MULTIPLES':
    case 'YIELDS_AND_CAPEX_RATIOS':
    case 'MARGINS_AND_RETURNS':
      return financeBaseSorter
    default:
      return []
  }
}

export const toDataSetMeta = (
  { meta, target }: TransformChartOptionToDataSetQueryArgs,
  blockId: string,
) => {
  // const selectedOption = Object.values(meta.options).find((option) => !!option.id)

  return {
    // id: selectedOption?.id || 0,
    // planId: selectedOption?.planId || 0,
    // blockId,
    // s: meta.s,
    market: target.country,
  }
}

export type TransformChartOptionToDataSetQueryArgs = { meta: ChartOptionValueModel } & AssetModel
export const transformChartOptionToDataSetQuery = (
  { meta, target }: TransformChartOptionToDataSetQueryArgs,
  blockId: string,
) => {
  const { visualizationType, chartPresetType, options } = meta

  return {
    meta: toDataSetMeta({ meta, target }, blockId),
    config: {
      visualizationType: toVisualizationType(visualizationType),
      options: {
        title: toTitle(chartPresetType),
      },
    },
    datasetSelection: {
      from: {
        datasetType: toDataSetType(chartPresetType),
      },
      select: {
        fields: toSelectFields({ meta, target }),
        aggregations: toSelectAggregations(chartPresetType),
      },
      filter: {
        conditions: toFilterConditions({ meta, target }),
      },
      groupBy: {
        conditions: toGroupByConditions(chartPresetType, options?.TIME_FRAME?.value),
      },
      sort: {
        conditions: toSortConditions({ meta, target }),
      },
    },
  } satisfies DataSetQueryModel
}

export const getRenderChartComponentType = (
  chartOptions: ChartOptionValueModel,
  chartVisualizationKey: ChartVisualizationKey,
): RenderChartComponentType | undefined => {
  const { chartPresetType } = chartOptions

  const renderChartComponentTypeByOption: {
    [k in ChartPresetKey]: { [j in ChartVisualizationKey]?: RenderChartComponentType }
  } = {
    PRICE_INFORMATION: {
      // LINE_CHART: ['tradingview', ['line', 'bar']],
      // CANDLESTICK_CHART: ['tradingview', ['candlestick', 'bar']],
      LINE_CHART: ['recharts', ['line']],
      CANDLESTICK_CHART: ['recharts', ['line']],
    },
    MAJOR_STOCK_INDEX_PERFORMANCE: {
      LINE_CHART: ['recharts', ['line']],
    },
    AGENT_STOCK_INDEX_PERFORMANCE: {
      LINE_CHART: ['recharts', ['line']],
    },
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: {
      LINE_CHART: ['recharts', ['line']],
      BAR_CHART: ['recharts', ['bar']],
    },
    PRICE_AND_DIVIDEND_CHART: {
      LINE_CHART: ['recharts', ['line', 'bar']],
    },
    VALUATION_MULTIPLES_CHART: {
      LINE_CHART: ['recharts', ['line']],
    },
    VALUATION_MULTIPLES: {
      LINE_CHART: ['recharts', ['line']],
    },
    YIELDS_AND_CAPEX_RATIOS: {
      LINE_CHART: ['recharts', ['line']],
    },
    INCOME_STATEMENT_TRENDS: {
      BAR_CHART: ['recharts', ['line', 'bar']],
    },
    CASH_FLOW_STATEMENT_VISUALIZATION: {
      BAR_CHART: ['recharts', ['bar']],
    },
    MARGINS_AND_RETURNS: {
      LINE_CHART: ['recharts', ['line']],
    },
    BALANCE_SHEET_HIGHLIGHTS: {
      BAR_CHART: ['recharts', ['bar']],
    },
    ETF_WEIGHTS: {
      PIE_CHART: ['recharts', ['pie']],
    },
    NONE: {},
  }

  return renderChartComponentTypeByOption[chartPresetType][chartVisualizationKey]
}

export type ChartYValue =
  | number
  | string
  | { open: number; high: number; low: number; close: number }
export type ChartData = {
  metadata: {
    title?: string
    description?: string
    lastUpdated?: string
    dataType: 'timeseries' | 'categorical' | 'scatter'
    // 툴팁 관련 옵션 추가
    tooltipOptions?: {
      showUnit?: boolean
      showScale?: boolean
      customFormatter?: (value: any, name: string, unit?: string, scale?: string) => string
    }
  }

  axes: {
    x: {
      label: string
      type: 'datetime' | 'numeric' | 'category'
      format?: string
      labelHidden?: boolean
    }
    y: {
      primary: {
        label: string
        type: 'numeric'
        format?: string
        domain?: [number, number] // y축 범위
        tickFormat?: string
        scale?: string
        unit?: string
        hidden?: boolean
      }
      secondary?: {
        label: string
        type: 'numeric'
        format?: string
        domain?: [number, number]
        tickFormat?: string
        position?: 'left' | 'right' // 축 위치
        scale?: string
        unit?: string
        hidden?: boolean
      }
    }
  }

  series: {
    name: string
    data: {
      x: number | string
      y: ChartYValue
      rawData?: any
    }[]
    type?: 'line' | 'bar' | 'pie' | 'candlestick' | 'area' | 'stack_bar'
    color?: string
    visible?: boolean
    yAxisId?: 'primary' | 'secondary' // 어떤 y축을 사용할지 지정
    opacity?: number
    scale?: string
    unit?: string
  }[]
}

export type ChartDataOptions = {
  title?: string
  xField:
    | DataSetField
    | { fields: DataSetField[]; format?: (values: any[]) => string; labelHidden?: boolean }
  yFields: {
    field: DataSetField[]
    axis?: 'primary' | 'secondary'
    axisHidden?: boolean
    type?: 'line' | 'bar' | 'pie' | 'candlestick' | 'stack_bar'
    color?: string
    scale?: string
    unit?: string
  }[]
  groupBy?: DataSetField
}
export const transformDataSetToChartData = (
  dataSet: DataSetModel,
  options: ChartDataOptions,
): ChartData => {
  // 기본 설정값
  const xField = options.xField || 'date'
  const yFields = options.yFields || []
  const groupByField = options.groupBy

  // 컬럼 정보 매핑
  const columnMap = dataSet.columns.reduce(
    (acc, col) => {
      acc[col.field] = col
      return acc
    },
    {} as Record<string, (typeof dataSet.columns)[0]>,
  )

  // ChartData 기본 구조 생성
  const chartData: ChartData = {
    metadata: {
      title: options?.title || 'Chart',
      dataType: 'timeseries',
      lastUpdated: new Date().toISOString(),
      tooltipOptions: {
        showUnit: true,
        showScale: true,
      },
    },
    axes: {
      x: {
        label:
          typeof xField === 'object'
            ? xField.fields.map((f) => columnMap[f]?.field || f).join('-')
            : columnMap[xField]?.field || 'Date',
        type: (typeof xField === 'object'
          ? 'category'
          : columnMap[xField]?.type === undefined
            ? 'date'
            : 'category') as any,
        format: typeof xField === 'object' ? undefined : columnMap[xField]?.format || 'YYYYMMDD',
        labelHidden: typeof xField === 'object' ? xField.labelHidden : false,
      },
      y: {
        primary: {
          label: '',
          type: 'numeric',
          // 기본 y축에 대한 unit과 scale 설정
          unit: yFields.find((f) => f.axis === 'primary' || !f.axis)?.unit,
          scale: yFields.find((f) => f.axis === 'primary' || !f.axis)?.scale,
          hidden: yFields.find((f) => f.axis === 'primary' || !f.axis)?.axisHidden,
        },
      },
    },
    series: [],
  }

  // 두 번째 y축이 필요한 경우
  if (yFields.some((f) => f.axis === 'secondary')) {
    chartData.axes.y.secondary = {
      label: '',
      type: 'numeric',
      // 보조 y축에 대한 unit과 scale 설정
      unit: yFields.find((f) => f.axis === 'secondary')?.unit,
      scale: yFields.find((f) => f.axis === 'secondary')?.scale,
      hidden: yFields.find((f) => f.axis === 'secondary')?.axisHidden,
    }
  }

  // 시리즈 데이터 생성
  // If groupBy is specified, group the data first
  if (groupByField) {
    // Group data by the specified field
    const groupedData = dataSet.rows.reduce<Record<string, typeof dataSet.rows>>((groups, row) => {
      const groupKey = String(row[groupByField] || 'undefined')
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(row)
      return groups
    }, {})

    // Create series for each group and each yField
    const groupedSeries: ChartData['series'] = []

    // Process each group
    Object.entries(groupedData).forEach(([groupKey, groupRows]) => {
      yFields.forEach((yField) => {
        const [singleField, ...elseFields] = yField.field
        const isMultipleField = elseFields.length > 0

        groupedSeries.push({
          name: `${groupKey}`,
          type: yField.type || 'line',
          yAxisId: yField.axis,
          color: yField.color,
          // unit과 scale 추가
          unit: yField.unit,
          scale: yField.scale,
          data: groupRows.map((row) => {
            // Handle combined x-axis fields
            let xValue: string | number
            if (typeof xField === 'object') {
              if (xField.format) {
                xValue = xField.format(xField.fields.map((field) => row[field]))
              } else {
                xValue = xField.fields.map((field) => row[field]).join('-')
              }
            } else {
              xValue = row[xField] as number | string
            }

            return {
              x: xValue,
              y: isMultipleField
                ? pick(yField.field, row)
                : (row[yField.field[0]] as ChartYValue as any),
              rawData: row,
            }
          }),
        })
      })
    })

    chartData.series = groupedSeries
  } else {
    // Original logic when no grouping is specified
    chartData.series = yFields.map((yField) => {
      const [singleField, ...elseFields] = yField.field
      const isMultipleField = elseFields.length > 0

      return {
        name: isMultipleField
          ? JSON.stringify(yField.field)
          : (fieldToLegend(singleField) as DataSetField) ||
            columnMap[singleField]?.field ||
            yField.field,
        type: yField.type || 'line',
        yAxisId: yField.axis,
        color: yField.color,
        // unit과 scale 추가
        unit: yField.unit,
        scale: yField.scale,
        hidden: yField.axisHidden,
        data: dataSet.rows.map((row) => {
          // Handle combined x-axis fields
          let xValue: string | number
          if (typeof xField === 'object') {
            if (xField.format) {
              xValue = xField.format(xField.fields.map((field) => row[field]))
            } else {
              xValue = xField.fields.map((field) => row[field]).join('-')
            }
          } else {
            xValue = row[xField] as number | string
          }

          return {
            x: xValue,
            y: isMultipleField
              ? pick(yField.field, row)
              : (row[yField.field[0]] as ChartYValue as any),
            rawData: row,
          }
        }),
      }
    })
  }

  return chartData
}

export const toChartDataOptions = (
  dataSet: DataSetModel,
  renderChartModel: RenderChartModel,
): ChartDataOptions => {
  const dateOption = Object.values(renderChartModel.meta.options).find((d) => d.value)
  const [from, to] = toDateTimeRanges(dateOption?.value, {
    referenceTime: renderChartModel.meta.referenceTime,
    dateTimeFormat: 'YYYY-MM-DD',
  })
  
  const titleTemplate = `(${from} ~ ${to})`

  // dataSet의 columns에서 field별 정보를 추출
  const columnMap = dataSet.columns.reduce(
    (acc, col) => {
      acc[col.field] = col
      return acc
    },
    {} as Record<string, (typeof dataSet.columns)[0]>,
  )

  const chartOptionsMap: { [k in ChartPresetKey]: ChartDataOptions } = {
    PRICE_INFORMATION: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}\n${titleTemplate}`,
      xField: {
        fields: ['date'],
        labelHidden: true,
      },
      yFields:
        renderChartModel.meta.visualizationType === 'CANDLESTICK_CHART'
          ? [
              {
                field: ['close'],
                axis: 'primary',
                type: 'line',
                unit: columnMap['close']?.unit,
                scale: columnMap['close']?.scale,
                axisHidden: true,
              },
            ]
          : [
              {
                field: ['close'],
                axis: 'primary',
                type: 'line',
                unit: columnMap['close']?.unit,
                scale: columnMap['close']?.scale,
                axisHidden: true,
              },
            ],
    },
    MAJOR_STOCK_INDEX_PERFORMANCE: {
      title: `Major Stock Index Performance\n${titleTemplate}`,
      xField: 'date',
      yFields: [
        {
          field: ['close'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['close']?.unit,
          scale: columnMap['close']?.scale,
          axisHidden: true,
        },
      ],
      groupBy: 'ticker',
    },
    AGENT_STOCK_INDEX_PERFORMANCE: {
      title: `Major Stock Index Performance\n${titleTemplate}`,
      xField: 'date',
      yFields: [
        {
          field: ['close'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['close']?.unit,
          scale: columnMap['close']?.scale,
          axisHidden: true,
        },
      ],
      groupBy: 'ticker',
    },
    ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: {
      title: `Advanced Valuation & Efficiency Metrics\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
      },
      yFields: [
        {
          field: ['evToSales'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['close']?.unit,
          scale: columnMap['close']?.scale,
          axisHidden: true,
        },
        {
          field: ['evToOperatingCashFlow'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['close']?.unit,
          scale: columnMap['close']?.scale,
          axisHidden: true,
        },
        {
          field: ['evToEBITDA'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['evToEBITDA']?.unit,
          scale: columnMap['evToEBITDA']?.scale,
          axisHidden: true,
        },
        {
          field: ['earningsYield'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['earningsYield']?.unit,
          scale: columnMap['earningsYield']?.scale,
          axisHidden: true,
        },
        {
          field: ['freeCashFlowYield'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['freeCashFlowYield']?.unit,
          scale: columnMap['freeCashFlowYield']?.scale,
          axisHidden: true,
        },
        {
          field: ['capexToOperatingCashFlow'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['capexToOperatingCashFlow']?.unit,
          scale: columnMap['capexToOperatingCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['capexToDepreciation'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['capexToDepreciation']?.unit,
          scale: columnMap['capexToDepreciation']?.scale,
          axisHidden: true,
        },
      ],
    },
    PRICE_AND_DIVIDEND_CHART: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}\n${titleTemplate}`,
      xField: {
        fields: ['date'],
        labelHidden: true,
      },
      yFields: [
        {
          field: ['close'], //종가
          axis: 'primary',
          type: 'line',
          unit: columnMap['close']?.unit,
          scale: columnMap['close']?.scale,
          axisHidden: true,
        },
        {
          field: ['dividend'], //배당금
          axis: 'secondary',
          type: 'bar',
          unit: columnMap['dividend']?.unit,
          scale: columnMap['dividend']?.scale,
          axisHidden: true,
        },
      ],
    },
    VALUATION_MULTIPLES_CHART: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear'],
        format: (values) => `${values[0]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['peRatio'], //PER
          axis: 'primary',
          type: 'line',
          unit: columnMap['peRatio']?.unit,
          scale: columnMap['peRatio']?.scale,
          axisHidden: true,
        },
        {
          field: ['pbRatio'], //PBR
          axis: 'primary',
          type: 'line',
          unit: columnMap['pbRatio']?.unit,
          scale: columnMap['pbRatio']?.scale,
          axisHidden: true,
        },
      ].filter((field) => field.field.includes(renderChartModel.meta.options.VALUATION_METRIC?.value)) as ChartDataOptions['yFields'],
    },
    VALUATION_MULTIPLES: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
      },
      yFields: [
        {
          field: ['evToSales'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['evToSales']?.unit,
          scale: columnMap['evToSales']?.scale,
          axisHidden: true,
        },
        {
          field: ['evToEBITDA'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['evToEBITDA']?.unit,
          scale: columnMap['evToEBITDA']?.scale,
          axisHidden: true,
        },
        {
          field: ['evToOperatingCashFlow'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['evToOperatingCashFlow']?.unit,
          scale: columnMap['evToOperatingCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['evToFreeCashFlow'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['evToFreeCashFlow']?.unit,
          scale: columnMap['evToFreeCashFlow']?.scale,
          axisHidden: true,
        },
      ],
    },
    INCOME_STATEMENT_TRENDS: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear'],
        format: (values) => `${values[0]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['revenue'], //매출
          axis: 'primary',
          type: 'bar',
          unit: columnMap['revenue']?.unit,
          scale: columnMap['revenue']?.scale,
          axisHidden: true,
        },
        {
          field: ['operatingIncome'], //영업이익
          axis: 'primary',
          type: 'bar',
          unit: columnMap['operatingIncome']?.unit,
          scale: columnMap['operatingIncome']?.scale,
          axisHidden: true,
        },
        {
          field: ['netIncome'], //순이익
          axis: 'primary',
          type: 'bar',
          unit: columnMap['netIncome']?.unit,
          scale: columnMap['netIncome']?.scale,
          axisHidden: true,
        },
        {
          field: ['operatingProfitMargin'], //영업이익률
          axis: 'secondary',
          type: 'line',
          unit: columnMap['operatingProfitMargin']?.unit,
          scale: columnMap['operatingProfitMargin']?.scale,
          axisHidden: true,
        },
      ].filter((field) => field.field.includes(renderChartModel.meta.options.FINANCIAL_METRIC?.value)) as ChartDataOptions['yFields'],
    },
    CASH_FLOW_STATEMENT_VISUALIZATION: {
      title: `Cash Flow Statement Visualization\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['operatingCashFlow'],
          axis: 'primary',
          type: 'bar',
          unit: columnMap['operatingCashFlow']?.unit,
          scale: columnMap['operatingCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['freeCashFlow'],
          axis: 'primary',
          type: 'bar',
          unit: columnMap['freeCashFlow']?.unit,
          scale: columnMap['freeCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['growthOperatingCashFlow'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['growthOperatingCashFlow']?.unit,
          scale: columnMap['growthOperatingCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['growthFreeCashFlow'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['growthFreeCashFlow']?.unit,
          scale: columnMap['growthFreeCashFlow']?.scale,
          axisHidden: true,
        },
      ],
    },
    MARGINS_AND_RETURNS: {
      title: `Margins & Returns\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['grossProfitMargin'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['grossProfitMargin']?.unit,
          scale: columnMap['grossProfitMargin']?.scale,
          axisHidden: true,
        },
        {
          field: ['ebitdaMargin'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['ebitdaMargin']?.unit,
          scale: columnMap['ebitdaMargin']?.scale,
          axisHidden: true,
        },
        {
          field: ['operatingProfitMargin'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['operatingProfitMargin']?.unit,
          scale: columnMap['operatingProfitMargin']?.scale,
          axisHidden: true,
        },
        {
          field: ['netProfitMargin'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['netProfitMargin']?.unit,
          scale: columnMap['netProfitMargin']?.scale,
          axisHidden: true,
        },
        {
          field: ['returnOnAssets'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['returnOnAssets']?.unit,
          scale: columnMap['returnOnAssets']?.scale,
          axisHidden: true,
        },
        {
          field: ['assetTurnover'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['assetTurnover']?.unit,
          scale: columnMap['assetTurnover']?.scale,
          axisHidden: true,
        },
      ],
    },
    BALANCE_SHEET_HIGHLIGHTS: {
      title: `Balance Sheet Highlights\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['totalAssets'],
          axis: 'primary',
          type: 'bar',
          unit: columnMap['totalAssets']?.unit,
          scale: columnMap['totalAssets']?.scale,
          axisHidden: true,
        },
        {
          field: ['totalLiabilities'],
          axis: 'primary',
          type: 'bar',
          unit: columnMap['totalLiabilities']?.unit,
          scale: columnMap['totalLiabilities']?.scale,
          axisHidden: true,
        },
        {
          field: ['totalEquity'],
          axis: 'primary',
          type: 'bar',
          unit: columnMap['totalEquity']?.unit,
          scale: columnMap['totalEquity']?.scale,
          axisHidden: true,
        },
        {
          field: ['debtToEquity'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['debtToEquity']?.unit,
          scale: columnMap['debtToEquity']?.scale,
          axisHidden: true,
        },
      ],
    },
    YIELDS_AND_CAPEX_RATIOS: {
      title: `Yields and Capex Ratios\n${titleTemplate}`,
      xField: {
        fields: ['fiscalYear', 'period'],
        format: (values) => `${values[0]}-${values[1]}`,
        labelHidden: true,
      },
      yFields: [
        {
          field: ['earningsYield'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['earningsYield']?.unit,
          scale: columnMap['earningsYield']?.scale,
          axisHidden: true,
        },
        {
          field: ['freeCashFlowYield'],
          axis: 'primary',
          type: 'line',
          unit: columnMap['freeCashFlowYield']?.unit,
          scale: columnMap['freeCashFlowYield']?.scale,
          axisHidden: true,
        },
        {
          field: ['capexToOperatingCashFlow'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['capexToOperatingCashFlow']?.unit,
          scale: columnMap['capexToOperatingCashFlow']?.scale,
          axisHidden: true,
        },
        {
          field: ['returnOnInvestedCapital'],
          axis: 'secondary',
          type: 'line',
          unit: columnMap['returnOnInvestedCapital']?.unit,
          scale: columnMap['returnOnInvestedCapital']?.scale,
          axisHidden: true,
        },
      ],
    },
    ETF_WEIGHTS: {
      title: `${renderChartModel.target.name} - ${renderChartModel.target.ticker}`,
      xField: {
        fields: ['ticker'],
      },
      yFields: [
        {
          field: ['weight'],
          axis: 'primary',
          type: 'pie',
        },
      ],
    },
    NONE: {
      title: 'NONE',
      xField: {
        fields: [],
      },
      yFields: [],
    },
  }

  return chartOptionsMap[renderChartModel.meta.chartPresetType]
}

export const createRenderChartDefaultMeta = (key: ChartPresetKey): ChartOptionValueModel => {
  const meta = clone(renderChartDefaultMetaByKey[key])

  return {
    ...meta,
    referenceTime: dayjs().valueOf(),
  }
}

export const fieldToLegend = (field: DataSetField): string => {
  const columnLegendMap: Record<DataSetField, string> = {
    // Basic fields
    id: 'ID',
    ticker: 'Ticker',
    symbol: 'Symbol',
    date: 'Date',
    bsDate: 'Date',
    year: 'Year',
    quarter: 'Quarter',
    fiscalYear: 'Fiscal Year',
    period: 'Period',

    // Price/Chart fields
    open: 'Open',
    high: 'High',
    low: 'Low',
    close: '종가', //'Close',
    price: 'Price',
    volume: 'Volume',
    sma5: '5-Day SMA',
    sma10: '10-Day SMA',
    sma20: '20-Day SMA',
    sma50: '50-Day SMA',
    sma120: '120-Day SMA',

    // Financial statement fields
    revenue: '매출', //'Revenue',
    grossProfit: 'Gross Profit',
    operatingIncome: '영업이익', //'Operating Income',
    netIncome: '순이익', //'Net Income',
    eps: 'EPS',
    epsdiluted: 'EPS Diluted',

    // Balance sheet fields
    totalAssets: 'Total Assets',
    totalLiabilities: 'Total Liabs',
    totalEquity: 'Total Equity',
    netDebt: 'Net Debt',

    // Cash flow fields
    netCashProvidedByOperatingActivities: 'Net Cash Provided By Operating Activities',
    operatingCashFlow: 'Op. Cash Flow',
    freeCashFlow: 'FCF',
    capitalExpenditure: 'Capital Expenditure',
    growthOperatingCashFlow: 'Growth Operation Cash Flow',
    growthFreeCashFlow: 'Growth Free Cash Flow',

    // Per share metrics
    revenuePerShare: 'Revenue Per Share',
    netIncomePerShare: 'Net Income Per Share',
    operatingCashFlowPerShare: 'Op. Cash Flow Per Share',
    freeCashFlowPerShare: 'FCF Per Share',

    // Ratios and metrics
    debtToEquity: 'Debt/Equity',
    currentRatio: 'Current Ratio',
    interestCoverage: 'Interest Coverage',
    netDebtToEBITDA: 'Net Debt To Ebitda',
    debtToAssets: 'Debt To Assets',
    peRatio: 'PER', //'PE Ratio',
    pbRatio: 'PBR', //'PB Ratio',
    payoutRatio: 'Payout Ratio',
    dividendYield: 'Dividend Yield',
    chartDividendYield: 'Dividend Yield',
    dividend: '배당금', //'Dividend',
    priceToSalesRatio: 'Price To Sales Ratio',

    // Valuation metrics
    evToOperatingCashFlow: 'EV/Operating Cash Flow',
    earningsYield: 'Earnings Yield',
    freeCashFlowYield: 'Free Cash Flow Yield',
    roic: 'ROIC',

    // Ownership metrics
    ownershipPercent: 'Ownership Percent',
    ownershipPercentChange: 'Ownership Percent Change',
    numberOf13Fshares: 'No.13F Shares',
    numberOf13FsharesChange: 'No.13F Shares Change',
    totalInvested: 'Total Invested',
    totalInvestedChange: 'Total Invested Change',

    evToFreeCashFlow: 'EV/FCF',
    evToEBITDA: 'EV/EBITDA',
    evToSales: 'EV/Sales',
    capexToOperatingCashFlow: 'Capex/OCF',
    capexToDepreciation: 'Capex/Dep',
    returnOnInvestedCapital: 'Return On Invested Capital',

    priceToFreeCashFlowRatio: 'Price To FreeCashFlow Ratio',
    priceToOperatingCashFlowRatio: 'Price To OperatingCashFlow Ratio',

    grossProfitMargin: 'Gross Profit Margin',
    operatingProfitMargin: '영업이익률', //'Operating Profit Margin',
    netProfitMargin: 'Net Profit Margin',
    assetTurnover: 'Asset Turnover',

    returnOnAssets: 'Return On Assets',
    ebitdaMargin: 'Ebitda Margin',

    weight: 'Weight',
  }

  return columnLegendMap[field] || field
}

// 툴팁 포매터 함수 생성
export const createTooltipFormatter = (chartData: ChartData) => {
  return (value: any, name: string, props?: any) => {
    const series = chartData.series.find((s) => s.name === name)
    const unit = series?.unit
    const scale = series?.scale

    // 기본 포매터
    let formattedValue = typeof value === 'number' ? value.toLocaleString() : value

    // unit 추가
    switch (unit) {
      case 'USD':
        formattedValue = '$' + formattedValue
        break
      case 'KRW':
        formattedValue = '₩' + formattedValue
        break
      default:
        formattedValue = formattedValue
    }

    if (scale) {
      switch (scale) {
        case 'decimal':
          formattedValue = formattedValue
          break
        default:
          formattedValue = formattedValue + ` (${scale})`
          break
      }
    }

    return formattedValue
  }
}
