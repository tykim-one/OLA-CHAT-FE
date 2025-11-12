export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  errorCode?: string
}

// Question Types
export type Question = {
  id: string
  text: string
}

export type Stock = {
  id: string
  name: string
  ticker: string
}

// Request Types
export type RecommendQuestionsRequest = {}

export type PopularQuestionsRequest = {}

export type PopularStocksRequest = {}

// Response Types
export type RecommendQuestionsResponse = Response<Question[]>

export type PopularQuestionsResponse = Response<Question[]>

export type PopularStocksResponse = Response<Stock[]>
