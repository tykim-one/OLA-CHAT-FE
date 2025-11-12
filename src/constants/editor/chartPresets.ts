import { clone } from 'ramda'

import {
  ChartOptionGroupKey,
  ChartOptionValueModel,
  ChartPresetKey,
  ChartVisualizationKey,
} from '@/types/editor/chart'
import { PresetDataOption, PresetDataVisualizationModel, TimeFrameKey } from '@/types/editor/common'

const chartVisualizationOptions: PresetDataOption<ChartVisualizationKey>[] = [
  { id: 0, planId: 0, value: 'CANDLESTICK_CHART', label: 'CandleStick Chart', cost: 0 },
  { id: 0, planId: 0, value: 'LINE_CHART', label: 'Line Chart', cost: 0 },
  { id: 0, planId: 0, value: 'BAR_CHART', label: 'Bar Chart', cost: 0 },
]

const priceChartVisualizationOptions = chartVisualizationOptions.filter(
  (d) => d.value === 'CANDLESTICK_CHART',
)

const indexChartVisualizationOptions = chartVisualizationOptions.filter(
  (d) => d.value === 'LINE_CHART',
)

const valuationChartVisualizationOptions = chartVisualizationOptions.filter(
  (d) => d.value === 'LINE_CHART',
)

const commonChartVisualizationOptions = chartVisualizationOptions.filter(
  (d) => d.value !== 'CANDLESTICK_CHART',
)

const shortTermTimeFrameOptions: PresetDataOption<TimeFrameKey>[] = [
  { id: 1, planId: 1, value: '3M', label: '3 Month', cost: 1 },
  { id: 2, planId: 1, value: '6M', label: '6 Months', cost: 1 },
  { id: 3, planId: 2, value: '1y', label: '1 Year', cost: 1 },
  { id: 4, planId: 2, value: '5y', label: '5 Year', cost: 1 },
  { id: 5, planId: 3, value: '10y', label: '10 Year', cost: 1 },
]

const longTermTimeFrameOptions: PresetDataOption<TimeFrameKey>[] = [
  { id: 32, planId: 1, value: '1y', label: '1 Year', cost: 1 },
  { id: 33, planId: 2, value: '3y', label: '3 Years', cost: 1 },
  { id: 34, planId: 2, value: '5y', label: '5 Years', cost: 1 },
  { id: 35, planId: 3, value: '10y', label: '10 Years', cost: 1 },
]

// const financialPeriodOptions: PresetDataOption<TimeFrameKey>[] = [
//   { value: 'QUARTERLY', label: 'Quarterly' },
//   { value: 'ANNUAL', label: 'Annual' },
// ]

export type ChartPresetDataVisualizationModel = PresetDataVisualizationModel<
  string,
  ChartVisualizationKey,
  ChartPresetKey,
  ChartOptionGroupKey
>
export const priceAndVolumeChartPreset: ChartPresetDataVisualizationModel = {
  name: 'PRICE_INFORMATION',
  title: 'Price Information',
  subTitle: '(with Moving Average Line and Volume Trends)',
  description: 'Provide date-based price data for visualization in a chart.',
  visualizationOptions: [...priceChartVisualizationOptions],
  defaultVisualizationOptionValue: priceChartVisualizationOptions[0]?.value,
  defaultOptionGroupSelection: [
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 3, planId: 1, value: '1y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 4, planId: 2, value: '5y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 5, planId: 3, value: '10y', cost: 1 },
    },
  ],
  optionGroups: [
    {
      name: 'DATE_RANGE',
      label: 'Date Range',
      options: [...shortTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
  ],
}

export const majorStockIndexPerformanceChartPreset: ChartPresetDataVisualizationModel = {
  name: 'MAJOR_STOCK_INDEX_PERFORMANCE',
  title: 'Major Stock Index Performance',
  subTitle: '',
  description:
    'Provide real-time data on major market indices for trend analysis and investment decisions.',
  visualizationOptions: [...indexChartVisualizationOptions],
  defaultVisualizationOptionValue: indexChartVisualizationOptions[0]?.value,
  defaultOptionGroupSelection: [
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 3, planId: 1, value: '1y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 4, planId: 2, value: '5y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 5, planId: 3, value: '10y', cost: 1 },
    },
  ],
  optionGroups: [
    {
      name: 'DATE_RANGE',
      label: 'Date Range',
      options: [...shortTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
  ],
}

export const advancedValuationAndEfficiencyMetricsChartPreset: ChartPresetDataVisualizationModel = {
  name: 'ADVANCED_VALUATION_AND_EFFICIENCY_METRICS',
  title: 'Advanced Valuation & Efficiency Metrics',
  subTitle: '',
  description: 'Assist in deeper analysis of corporate valuation and operational efficiency.',
  visualizationOptions: [...valuationChartVisualizationOptions],
  defaultVisualizationOptionValue: valuationChartVisualizationOptions[0]?.value,
  defaultOptionGroupSelection: [
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 32, planId: 1, value: '1y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 33, planId: 2, value: '3y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 34, planId: 3, value: '5y', cost: 1 },
    },
  ],
  optionGroups: [
    {
      name: 'DATE_RANGE_ANNUAL',
      label: 'Annual',
      showLabel: true,
      options: [...longTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
    {
      name: 'DATE_RANGE_QUARTERLY',
      label: 'Quarterly',
      showLabel: true,
      options: [...longTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
  ],
  mutuallyExclusiveOptionGroups: [['DATE_RANGE_ANNUAL', 'DATE_RANGE_QUARTERLY']],
}

export const priceAndDividendChartPreset: ChartPresetDataVisualizationModel = {
  name: 'PRICE_AND_DIVIDEND_CHART',
  title: 'Price & Dividend',
  subTitle: '',
  description: 'Easily view stock prices and dividends at a glance.',
  visualizationOptions: [...priceChartVisualizationOptions],
  defaultVisualizationOptionValue: priceChartVisualizationOptions[0]?.value,
  defaultOptionGroupSelection: [
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 3, planId: 1, value: '1y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 4, planId: 2, value: '5y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE',
      defaultValue: { id: 5, planId: 3, value: '10y', cost: 1 },
    },
  ],
  optionGroups: [
    {
      name: 'DATE_RANGE',
      label: 'Date Range',
      options: [...shortTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
  ],
}

export const valuationMultiplesChartPreset: ChartPresetDataVisualizationModel = {
  name: 'VALUATION_MULTIPLES_CHART',
  title: 'Valuation Multiples Chart',
  subTitle: '',
  description: 'Allows comparison of company valuation trends.',
  visualizationOptions: [...valuationChartVisualizationOptions],
  defaultVisualizationOptionValue: valuationChartVisualizationOptions[0]?.value,
  defaultOptionGroupSelection: [
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 32, planId: 1, value: '1y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 33, planId: 2, value: '3y', cost: 1 },
    },
    {
      optionGroup: 'DATE_RANGE_ANNUAL',
      defaultValue: { id: 34, planId: 3, value: '5y', cost: 1 },
    },
  ],
  optionGroups: [
    {
      name: 'DATE_RANGE_ANNUAL',
      label: 'Annual',
      showLabel: true,
      options: [...longTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
    {
      name: 'DATE_RANGE_QUARTERLY',
      label: 'Quarterly',
      showLabel: true,
      options: [...longTermTimeFrameOptions],
      defaultValue: {
        id: 0,
        planId: 0,
        value: '',
        cost: 0,
      },
      useGenerate: true,
    },
  ],
  mutuallyExclusiveOptionGroups: [['DATE_RANGE_ANNUAL', 'DATE_RANGE_QUARTERLY']],
}

const parseGeneratorBlockPreset = <T, K, N, O>(
  preset: PresetDataVisualizationModel<T, K, N, O>,
): PresetDataVisualizationModel<T, K, N, O> => {
  return {
    ...preset,
    optionGroups: preset.optionGroups.filter((optionGroup) => !!optionGroup.useGenerate),
  }
}

export const chartGeneratorPresets: ChartPresetDataVisualizationModel[] = [
  parseGeneratorBlockPreset(priceAndVolumeChartPreset),
  parseGeneratorBlockPreset(majorStockIndexPerformanceChartPreset),
  parseGeneratorBlockPreset(advancedValuationAndEfficiencyMetricsChartPreset),
  parseGeneratorBlockPreset(priceAndDividendChartPreset),
  parseGeneratorBlockPreset(valuationMultiplesChartPreset),
]

// preset 상수들 depreciated
export const chartGeneratorPresetByKey: {
  [k in ChartPresetKey]: ChartPresetDataVisualizationModel
} = {
  PRICE_INFORMATION: parseGeneratorBlockPreset(priceAndVolumeChartPreset),
  MAJOR_STOCK_INDEX_PERFORMANCE: parseGeneratorBlockPreset(majorStockIndexPerformanceChartPreset),
  ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: parseGeneratorBlockPreset(
    advancedValuationAndEfficiencyMetricsChartPreset,
  ),
  PRICE_AND_DIVIDEND_CHART: parseGeneratorBlockPreset(priceAndDividendChartPreset),
  VALUATION_MULTIPLES_CHART: parseGeneratorBlockPreset(valuationMultiplesChartPreset),
} as any

export const renderChartPresetByKey: {
  [k in ChartPresetKey]: ChartPresetDataVisualizationModel
} = {
  PRICE_INFORMATION: clone(priceAndVolumeChartPreset),
  MAJOR_STOCK_INDEX_PERFORMANCE: clone(majorStockIndexPerformanceChartPreset),
  ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: clone(
    advancedValuationAndEfficiencyMetricsChartPreset,
  ),
  PRICE_AND_DIVIDEND_CHART: clone(priceAndDividendChartPreset),
  VALUATION_MULTIPLES_CHART: clone(valuationMultiplesChartPreset),
} as any

export const renderChartDefaultMetaByKey: {
  [k in ChartPresetKey]: ChartOptionValueModel
} = {
  PRICE_INFORMATION: {
    chartPresetType: 'PRICE_INFORMATION',
    visualizationType: 'CANDLESTICK_CHART',
    referenceTime: 0,
    s: '',
    options: {
      DATE_RANGE: {
        id: 3,
        planId: 1,
        value: '1y',
        cost: 1,
      },
    },
  },
  MAJOR_STOCK_INDEX_PERFORMANCE: {
    chartPresetType: 'MAJOR_STOCK_INDEX_PERFORMANCE',
    visualizationType: 'LINE_CHART',
    referenceTime: 0,
    s: '',
    options: {
      DATE_RANGE: {
        id: 3,
        planId: 1,
        value: '1y',
        cost: 1,
      },
    },
  },
  ADVANCED_VALUATION_AND_EFFICIENCY_METRICS: {
    chartPresetType: 'ADVANCED_VALUATION_AND_EFFICIENCY_METRICS',
    visualizationType: 'LINE_CHART',
    referenceTime: 0,
    s: '',
    options: {
      DATE_RANGE: {
        id: 33,
        planId: 2,
        value: '1y',
        cost: 1,
      },
    },
  },
  PRICE_AND_DIVIDEND_CHART: {
    chartPresetType: 'PRICE_AND_DIVIDEND_CHART',
    visualizationType: 'LINE_CHART',
    referenceTime: 0,
    s: '',
    options: {
      DATE_RANGE: {
        id: 3,
        planId: 1,
        value: '1y',
        cost: 1,
      },
    },
  },
  VALUATION_MULTIPLES_CHART: {
    chartPresetType: 'VALUATION_MULTIPLES_CHART',
    visualizationType: 'LINE_CHART',
    referenceTime: 0,
    s: '',
    options: {
      DATE_RANGE: {
        id: 33,
        planId: 2,
        value: '1y',
        cost: 1,
      },
    },
  },
} as any
