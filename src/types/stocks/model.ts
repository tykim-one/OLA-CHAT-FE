export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  errorCode?: string
}

// OLA Security Types
export type SearchStockModel = {
  id: string
  ticker: string
  name: string
  market: string
  isoCode: string
  score: number
}

// Request Types
export type StocksSearchRequest = {
  search?: string
  limit?: number
  offset?: number
}

// Response Types
export type StocksSearchResponse = SearchStockModel[]
