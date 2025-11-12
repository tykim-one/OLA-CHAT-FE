import { SearchStockModel, StocksSearchRequest } from '@/types/stocks/model'

import { StocksSearchRequestDto, StocksSearchResponseDto } from '@/http/stocks/types'

export const transformStockDTO = (
  stockDTO: StocksSearchResponseDto,
): SearchStockModel => ({
  id: stockDTO.source.stock_id,
  ticker: stockDTO.source.symbol,
  name: stockDTO.source.name_kr || stockDTO.source.name_en,
  market: stockDTO.source.market,
  isoCode: stockDTO.source.country,
  score: stockDTO.score,
})

export const transformStockModel = (
  stock: SearchStockModel,
): StocksSearchResponseDto => ({
  score: stock.score,
  source: {
    stock_id: stock.id,
    symbol: stock.ticker,
    name_kr: stock.name,
    name_en: stock.name,
    market: stock.market,
    country: stock.isoCode,
    delisted: false,
    delisted_date: null,
    delisted_reason: null,
    is_active_trade: true,
  },
})

export const transformStockSearchRequest = (
  request?: StocksSearchRequest,
): StocksSearchRequestDto => ({
  query: request?.search,
  limit: request?.limit,
  offset: request?.offset,
})
