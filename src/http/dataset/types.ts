export type Config = {
  visualization_type?: string
  options?: any
}

export type Credit = {
  unit: 'YEAR' | 'MONTH' | ''
  range: number | string
  bi: string //billling_id
  version: number
}

export type Meta = {
  market: string
}

export type RawMeta = {
  market: string
}

export type RawCredit = {
  unit: 'YEAR' | 'MONTH' | ''
  range: number | string
  billling_id: number
  version: number
}

export type DataSetType = 'Price' | 'Finance' | 'Form' | 'None'

export type RawDataSetField =
  | 'id'
  | 'date'
  | 'ticker'
  | 'symbol'
  | 'fiscal_year'
  | 'year'
  | 'quarter'
  | 'period'
  | 'olasecurityid'
  | 'bs_filling_date'
  // 차트 타입
  | 'open'
  | 'high'
  | 'low'
  | 'close'
  | 'price'
  | 'volume'
  | 'sma_5'
  | 'sma_10'
  | 'sma_20'
  | 'sma_50'
  | 'sma_120'
  | 'km_ev_to_ebitda'
  | 'km_ev_to_operating_cash_flow'
  | 'km_earnings_yield'
  | 'km_free_cash_flow_yield'
  | 'km_roic'
  // 테이블 타입
  | 'revenue'
  | 'is_gross_profit'
  | 'operating_income'
  | 'net_income'
  | 'is_eps'
  | 'is_eps_diluted'
  | 'bs_total_assets'
  | 'bs_total_liabilities'
  | 'bs_total_equity'
  | 'bs_net_debt'
  | 'cf_net_cash_provided_by_operating_activities'
  | 'cf_operating_cash_flow'
  | 'cf_free_cash_flow'
  | 'operating_cash_flow_growth'
  | 'free_cash_flow_growth'
  | 'cf_capital_expenditure'
  | 'ra_revenue_per_share'
  | 'ra_net_income_per_share'
  | 'ra_operating_cash_flow_per_share'
  | 'ra_free_cash_flow_per_share'
  | 'ra_debt_to_equity_ratio'
  | 'km_current_ratio'
  | 'ra_interest_coverage_ratio'
  | 'km_net_debt_to_ebitda'
  | 'ra_debt_to_assets_ratio'
  | 'price_to_earnings_ratio'
  | 'price_to_book_ratio'
  | 'ra_dividend_payout_ratio'
  | 'ra_dividend_yield'
  | 'yield'
  | 'dividend'
  | 'ra_price_to_sales_ratio'
  | 'ra_price_to_free_cash_flow_ratio'
  | 'ra_price_to_operating_cash_flow_ratio'
  | 'ownership_percent'
  | 'ownership_percent_change'
  | 'number_of_13f_shares'
  | 'number_of_13f_shares_change'
  | 'total_invested'
  | 'total_invested_change'
  | 'km_ev_to_sales'
  | 'km_ev_to_free_cash_flow'
  | 'km_capex_to_operating_cash_flow'
  | 'km_capex_to_depreciation'
  | 'km_return_on_invested_capital'
  | 'ra_gross_profit_margin'
  | 'operating_profit_margin'
  | 'ra_net_profit_margin'
  | 'ra_asset_turnover'
  | 'ra_ebitda_margin'
  | 'km_return_on_assets'

export type DataSetField =
  // 차트 타입
  | 'id'
  | 'olasecurityid'
  | 'ticker'
  | 'symbol'
  | 'date'
  | 'bsDate'
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
  | 'earningsYield'
  | 'freeCashFlowYield'
  | 'roic'
  // 테이블 타입
  | 'fiscalYear'
  | 'quarter'
  | 'year'
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
  | 'date'
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
  | 'evToSales'
  | 'evToFreeCashFlow'
  | 'evToEBITDA'
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

export type FilterOperator = 'eq' | 'gt' | 'lt' | 'in' | 'between' | 'contains'
export type PaginationOperator = 'limit' | 'offset'

export type SortOrder = 'desc' | 'asc'

export type AggregationFunction = 'sum' | 'avg' | 'min' | 'max' | 'count'

export type DataSetSelectAggregation = {
  field: DataSetField
  aggregation_function?: AggregationFunction
}

export type GroupByAggregationType = 'value' | 'year' | 'quarter' | 'month' | 'week' | 'day'

export type DataSetGroupByCondition = {
  field: DataSetField
  aggregation_type: GroupByAggregationType
}

export type DataSetSelection = {
  from: {
    dataset_type: DataSetType
  }
  select: {
    fields: DataSetField[]
    aggregations?: DataSetSelectAggregation[]
  }
  filter?: {
    conditions?: {
      field: DataSetField
      operator: FilterOperator
      value: any
    }[]
  }
  group_by?: {
    conditions?: DataSetGroupByCondition[]
  }
  sort?: {
    conditions?: {
      field: DataSetField
      order: SortOrder
      priority?: number
    }[]
  }
  pagination?: Partial<Record<PaginationOperator, number | string>>
}

export type DataSetQueryDTO = {
  meta?: Meta
  config?: Config
  // credit: Credit
  dataset_selection: DataSetSelection
}

export type DataSetDTO = {
  meta: {
    s: string //sessionId
  }
  columns: {
    field: DataSetField
    type?: string // 'number' | 'string' | 'datetime' ...
    unit?: string // 'KRW' | 'USD' | '%' ...
    scale?: string //Million | Billion...
    format?: string // YYYY-MM-DD ...
  }[]
  rows: Partial<Record<DataSetField, number | string>>[] // or
}

export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
}

export type ContentDataSetsRequest = DataSetQueryDTO
export type ContentDataSetsResponse = Response<DataSetDTO>

export type RawDataSetSelectAggregation = {
  field: RawDataSetField
  aggregation_function?: AggregationFunction
}

export type RawDataSetGroupByCondition = {
  field: RawDataSetField
  aggregation_type: GroupByAggregationType
}

// Raw Request / Response
export type RawDataSetSelection = {
  from: {
    dataset_type: DataSetType
  }
  select: {
    fields: RawDataSetField[]
    aggregations?: RawDataSetSelectAggregation[]
  }
  filter?: {
    conditions?: {
      field: RawDataSetField
      operator: FilterOperator
      value: any
    }[]
  }
  group_by?: {
    conditions?: RawDataSetGroupByCondition[]
  }
  sort?: {
    conditions?: {
      field: RawDataSetField
      order: SortOrder
      priority?: number
    }[]
  }
  pagination?: Partial<Record<PaginationOperator, number | string>>
}

export type RawDataSetQueryDTO = {
  meta?: RawMeta
  config?: Config
  credit?: RawCredit
  dataset_selection: RawDataSetSelection
}

export type RawDataSetDTO = {
  meta: {
    session_id: string
  }
  columns: {
    field: RawDataSetField
    type?: string // 'number' | 'string' | 'datetime' ...
    unit?: string // 'KRW' | 'USD' | '%' ...
    scale?: string //Million | Billion...
    format?: string // YYYY-MM-DD ...
  }[]
  rows: Partial<Record<RawDataSetField, number | string>>[] // or
}

export type RawContentDataSetRequest = RawDataSetQueryDTO
export type RawContentDataSetsResponse = RawDataSetDTO
