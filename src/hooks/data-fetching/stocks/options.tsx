import { UseQueryOptions } from '@tanstack/react-query'

import { SearchStockModel } from '@/types/stocks/model'

import * as api from '@/http/stocks/api'
import { StocksSearchRequest } from '@/types/stocks/model'

import { keys } from './keys'
import { transformStockDTO, transformStockSearchRequest } from './transforms'

export type StockListQueryOptions = Partial<UseQueryOptions<SearchStockModel[]>>

export const getStockListQueryOptions = (
  request?: StocksSearchRequest,
  options?: StockListQueryOptions,
) => ({
  queryKey: keys.GET_STOCK_LIST(request?.search || ''),
  queryFn: async () => {
    await Promise.resolve()
    const response = await api.stocksSearch(transformStockSearchRequest(request))
    return response.map(transformStockDTO)
  },
  ...options,
})
