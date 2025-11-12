import { TimeUnit } from '../editor'

export type VisualizationType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'spread_sheet'
  | 'candlestick'
  | 'stack_bar'

export type DataSetType = 'Price' | 'Finance' | 'Form' | 'None'

export type DataSetField =
  | 'id'
  | 'date'
  | 'bsDate'
  | 'ticker'
  | 'symbol'
  | 'year'
  | 'quarter'
  // 차트 타입
  | 'open'
  | 'high'
  | 'low'
  | 'close'
  | 'price'
  | 'volume'
  | 'sma5'
  | 'sma10'
  | 'sma20'
  | 'sma50'
  | 'sma120'
  | 'evToOperatingCashFlow'
  | 'evToFreeCashFlow' //없는듯. 확인후 요청
  | 'evToEBITDA'
  | 'evToSales'
  | 'earningsYield'
  | 'freeCashFlowYield'
  | 'roic'
  // 테이블 타입
  | 'fiscalYear'
  | 'period'
  | 'revenue'
  | 'grossProfit'
  | 'operatingIncome'
  | 'netIncome'
  | 'eps'
  | 'epsdiluted'
  | 'totalAssets'
  | 'totalLiabilities'
  | 'totalEquity'
  | 'netDebt'
  | 'netCashProvidedByOperatingActivities'
  | 'operatingCashFlow'
  | 'freeCashFlow'
  | 'growthOperatingCashFlow'
  | 'growthFreeCashFlow'
  | 'capitalExpenditure'
  | 'revenuePerShare'
  | 'netIncomePerShare'
  | 'operatingCashFlowPerShare'
  | 'freeCashFlowPerShare'
  | 'debtToEquity'
  | 'currentRatio'
  | 'interestCoverage'
  | 'netDebtToEBITDA'
  | 'debtToAssets'
  | 'peRatio'
  | 'pbRatio'
  | 'payoutRatio'
  | 'dividendYield'
  | 'chartDividendYield'
  | 'dividend'
  | 'priceToSalesRatio'
  | 'ownershipPercent'
  | 'ownershipPercentChange'
  | 'numberOf13Fshares'
  | 'numberOf13FsharesChange'
  | 'totalInvested'
  | 'totalInvestedChange'
  | 'capexToOperatingCashFlow'
  | 'returnOnInvestedCapital'
  | 'capexToDepreciation'
  | 'priceToFreeCashFlowRatio'
  | 'priceToOperatingCashFlowRatio'
  | 'grossProfitMargin'
  | 'operatingProfitMargin'
  | 'netProfitMargin'
  | 'assetTurnover'
  | 'ebitdaMargin'
  | 'returnOnAssets'
  | 'weight'

export type DataSetSelectAggregation<T extends DataSetField = DataSetField> = {
  field: T
  aggregationFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count'
}

export type DataSetFilterCondition<T extends DataSetField = DataSetField> = {
  field: T
  operator: 'eq' | 'gt' | 'lt' | 'between' | 'in' | 'contains'
  value: string | number | string[] | number[]
}

export type DataSetGroupByCondition<T extends DataSetField = DataSetField> = {
  field: T
  aggregationType: 'value' | 'year' | 'quarter' | 'month' | 'week' | 'day'
}

export type DataSetSortCondition<T extends DataSetField = DataSetField> = {
  field: T
  order: 'asc' | 'desc'
  priority?: number
}

export type DataSetPagination = {
  take?: string | number
  skip?: string | number
}

export type DataSetConfig = {
  visualizationType?: VisualizationType
  options?: any
}

export type DataSetCredit = {
  unit: TimeUnit
  range: number
  id: string //암호화 된 문자열
  version: number
}

export type DataSetBillingMetadata = {
  planId?: number
  id?: number //billingId
  blockId?: string
  s?: string //sessionId
  market: string
}

export type DataSetSelectionQuery<T extends DataSetField = DataSetField> = {
  from: {
    datasetType: DataSetType
  }
  select: {
    fields: readonly T[]
    aggregations?: DataSetSelectAggregation<T>[]
  }
  filter?: {
    conditions: DataSetFilterCondition<T>[]
  }
  groupBy?: {
    conditions: DataSetGroupByCondition<T>[]
  }
  sort?: {
    conditions: DataSetSortCondition<T>[]
  }
  pagination?: DataSetPagination
}

export type DataSetQueryModel<T extends DataSetField = DataSetField> = {
  meta?: DataSetBillingMetadata
  config?: DataSetConfig
  // credit?: DataSetCredit
  datasetSelection: DataSetSelectionQuery<T>
}

export type ExtractDataSetField<T> =
  T extends DataSetQueryModel<any> ? T['datasetSelection']['select']['fields'][number] : never

export type DataSetModel<T extends DataSetField = DataSetField> = {
  meta: {
    s: string //sessionId
  }
  columns: {
    field: T
    alias?: string
    type?: string // 'number' | 'string' | 'datetime' ...
    unit?: string // 'KRW' | 'USD' | '%' ...
    scale?: string
    format?: string // YYYY-MM-DD ...
  }[]
  rows: Partial<Record<T, number | string>>[]
}
