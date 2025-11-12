export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

// OLA Security Types
export type StocksSearchResponseDto = {
  score: number
  source: {
    stock_id: string
    symbol: string
    name_en: string
    name_kr: string
    market: string
    country: string
    delisted: boolean
    delisted_date: string | null
    delisted_reason: string | null
    is_active_trade: boolean
  }
}

// Request Types
export type StocksSearchRequestDto = {
  query?: string
  limit?: number
  offset?: number
}

// Response Types
export type StocksSearchResponse = StocksSearchResponseDto[]
