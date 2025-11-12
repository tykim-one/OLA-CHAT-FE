import { api } from '@/lib/http'

import { endpoints } from './endpoints'
import * as T from './types'

export const stocksSearch = async (args: T.StocksSearchRequestDto = {}) => {
  return api
    .get<T.StocksSearchResponse>(endpoints.STOCKS_SEARCH, { params: args })
    .then((d) => d.data)
}
