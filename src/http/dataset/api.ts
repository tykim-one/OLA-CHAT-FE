import { omit } from 'ramda'

import { api } from '@/lib/http/api'
import { simpleDecrypt, simpleEncrypt } from '@/lib/simpleEncrypt'
import { urlReplace } from '@/lib/url'

import { endpointParams, endpoints } from './endpoints'
import * as T from './types'

// fetchContentDataSets의 args은 string 포맷으로 들어와서(암호화) DataSetQueryDTO로 변환함
// args: string -> DataSetQueryDTO
export const fetchContentDataSets = async (args: string) => {
  try {
    const rawArgs = transformQueryToRaw(simpleDecrypt<T.DataSetQueryDTO>(args))
    const parsedArgs = {
      ...rawArgs,
      dataset_selection: omit(['from'], rawArgs.dataset_selection),
    }
    // console.log(JSON.stringify(parsedArgs))
    const response = await api.post<T.RawContentDataSetsResponse>(
      urlReplace(endpoints.FETCH_CONTENT_DATASETS, [
        [endpointParams.dataset_type, rawArgs.dataset_selection.from.dataset_type],
      ]),
      parsedArgs,
    )
    // console.log(JSON.stringify(response.data), transformRawToNormalized(response.data))
    return {
      ...response.data,
      data: transformRawToNormalized(response.data),
    }
  } catch (e) {
    return {
      error: true,
      data: null,
    } as any
  }
}

// 클라이언트에서 다루는 데이터를 서버데이터로 변환. 보안상의 이유로 데이터 변환작업 수행.
const fieldMappings: Record<T.RawDataSetField, T.DataSetField> = {
  id: 'id',
  olasecurityid: 'olasecurityid',
  ticker: 'ticker',
  symbol: 'symbol',
  fiscal_year: 'fiscalYear',
  date: 'date',
  bs_filling_date: 'bsDate',
  year: 'year',
  quarter: 'quarter',
  open: 'open',
  high: 'high',
  low: 'low',
  close: 'close',
  price: 'price',
  volume: 'volume',
  sma_5: 'sma5',
  sma_10: 'sma10',
  sma_20: 'sma20',
  sma_50: 'sma50',
  sma_120: 'sma120',
  km_ev_to_ebitda: 'evToEBITDA',
  km_ev_to_operating_cash_flow: 'evToOperatingCashFlow',
  km_earnings_yield: 'earningsYield',
  km_free_cash_flow_yield: 'freeCashFlowYield',
  km_roic: 'roic',
  period: 'period',
  revenue: 'revenue',
  is_gross_profit: 'grossProfit',
  operating_income: 'operatingIncome',
  net_income: 'netIncome',
  is_eps: 'eps',
  is_eps_diluted: 'epsdiluted',
  bs_total_assets: 'totalAssets',
  bs_total_liabilities: 'totalLiabilities',
  bs_total_equity: 'totalEquity',
  bs_net_debt: 'netDebt',
  cf_net_cash_provided_by_operating_activities: 'netCashProvidedByOperatingActivities',
  cf_operating_cash_flow: 'operatingCashFlow',
  cf_free_cash_flow: 'freeCashFlow',
  operating_cash_flow_growth: 'growthOperatingCashFlow',
  free_cash_flow_growth: 'growthFreeCashFlow',
  cf_capital_expenditure: 'capitalExpenditure',
  ra_revenue_per_share: 'revenuePerShare',
  ra_net_income_per_share: 'netIncomePerShare',
  ra_operating_cash_flow_per_share: 'operatingCashFlowPerShare',
  ra_free_cash_flow_per_share: 'freeCashFlowPerShare',
  ra_debt_to_equity_ratio: 'debtToEquity',
  km_current_ratio: 'currentRatio',
  ra_interest_coverage_ratio: 'interestCoverage',
  km_net_debt_to_ebitda: 'netDebtToEBITDA',
  ra_debt_to_assets_ratio: 'debtToAssets',
  price_to_earnings_ratio: 'peRatio',
  price_to_book_ratio: 'pbRatio',
  ra_dividend_payout_ratio: 'payoutRatio',
  ra_dividend_yield: 'dividendYield',
  yield: 'chartDividendYield',
  dividend: 'dividend',
  ra_price_to_sales_ratio: 'priceToSalesRatio',
  km_ev_to_sales: 'evToSales',
  km_ev_to_free_cash_flow: 'evToFreeCashFlow',
  km_capex_to_operating_cash_flow: 'capexToOperatingCashFlow',
  km_return_on_invested_capital: 'returnOnInvestedCapital',
  km_capex_to_depreciation: 'capexToDepreciation',
  ra_price_to_free_cash_flow_ratio: 'priceToFreeCashFlowRatio',
  ra_price_to_operating_cash_flow_ratio: 'priceToOperatingCashFlowRatio',

  ownership_percent: 'ownershipPercent',
  ownership_percent_change: 'ownershipPercentChange',
  number_of_13f_shares: 'numberOf13Fshares',
  number_of_13f_shares_change: 'numberOf13FsharesChange',
  total_invested: 'totalInvested',
  total_invested_change: 'totalInvestedChange',

  ra_gross_profit_margin: 'grossProfitMargin',
  operating_profit_margin: 'operatingProfitMargin',
  ra_net_profit_margin: 'netProfitMargin',
  ra_asset_turnover: 'assetTurnover',
  ra_ebitda_margin: 'ebitdaMargin',
  km_return_on_assets: 'returnOnAssets',
}

const reverseFieldMappings: Record<T.DataSetField, T.RawDataSetField> = Object.entries(
  fieldMappings,
).reduce(
  (acc, [raw, normalized]) => ({
    ...acc,
    [normalized]: raw,
  }),
  {} as Record<T.DataSetField, T.RawDataSetField>,
)

const toNormalizedField = (field: T.RawDataSetField): T.DataSetField => {
  return fieldMappings[field]
}

const toRawField = (field: T.DataSetField): T.RawDataSetField => {
  return reverseFieldMappings[field]
}

const transformRawToNormalized = (rawData: T.RawDataSetDTO): T.DataSetDTO => {
  return {
    meta: {
      s: rawData.meta?.session_id,
    },
    columns: rawData.columns.map((col) => ({
      ...col,
      field: toNormalizedField(col.field),
    })),
    rows: rawData.rows.map((row) => {
      const normalizedRow: Record<string, number | string> = {}
      Object.entries(row).forEach(([key, value]) => {
        normalizedRow[toNormalizedField(key as T.RawDataSetField)] = value
      })
      return normalizedRow
    }),
  }
}

const transformQueryToRaw = (query: T.DataSetQueryDTO): T.RawDataSetQueryDTO => {
  const { config, dataset_selection, meta } = query
  const { from, select, filter, sort, pagination, group_by } = dataset_selection

  return {
    meta: {
      // plan_id: meta?.plan_id!,
      // billing_id: meta?.billing_id!,
      // block_id: meta?.block_id!,
      // session_id: meta?.s!,
      market: meta?.market!,
    },
    config,
    // credit: {
    //   unit: credit.unit,
    //   range: credit.range,
    //   billling_id: Number(simpleDecrypt(credit.bi)),
    //   version: credit.version,
    // },
    dataset_selection: {
      from,
      select: {
        fields: select.fields.map(toRawField),
        aggregations: select.aggregations?.map((aggregation) => ({
          ...aggregation,
          field: toRawField(aggregation.field),
        })),
      },
      filter: filter && {
        conditions: filter.conditions?.map((condition) => ({
          ...condition,
          field: toRawField(condition.field),
        })),
      },
      group_by: group_by && {
        conditions: group_by.conditions?.map((condition) => ({
          ...condition,
          field: toRawField(condition.field),
        })),
      },
      sort: sort && {
        conditions: sort.conditions?.map((condition) => ({
          ...condition,
          field: toRawField(condition.field),
        })),
      },
      pagination: {
        ...pagination,
      },
    },
  }
}

export const transformDataSetQueryToRaw = async (args: string) => {
  try {
    const rawArgs = transformQueryToRaw(simpleDecrypt<T.DataSetQueryDTO>(args))
    const parsedArgs = {
      ...rawArgs,
      dataset_selection: omit(['from'], rawArgs.dataset_selection),
    }

    return simpleEncrypt({
      dataset_type: rawArgs.dataset_selection.from.dataset_type,
      dataset_payload: parsedArgs,
    })
  } catch {
    return simpleEncrypt(null)
  }
}
