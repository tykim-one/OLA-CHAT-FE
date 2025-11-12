import { useQuery } from '@tanstack/react-query'

import { StocksSearchRequest } from '@/types/stocks/model'

import { StockListQueryOptions, getStockListQueryOptions } from './options'

export const useGetStockListQuery = (
  request?: StocksSearchRequest,
  options?: StockListQueryOptions,
) => {
  return useQuery(getStockListQueryOptions(request, options))
}
