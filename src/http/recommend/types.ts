export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

// Question Types
export type QuestionDto = {
  id: string
  text: string
}

export type StockDto = {
  id: string
  name: string
  ticker: string
}

// Request Types (GET 요청이므로 빈 객체)
export type RecommendQuestionsRequest = {}

export type PopularQuestionsRequest = {}

export type PopularStocksRequest = {}

// Response Types
export type RecommendQuestionsResponse = Response<QuestionDto[]>

export type PopularQuestionsResponse = Response<QuestionDto[]>

export type PopularStocksResponse = Response<StockDto[]>
