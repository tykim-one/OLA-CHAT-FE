import { api } from '@/lib/http'

import { endpoints } from './endpoints'
import { mocks } from './mocks'
import * as T from './types'

// export const getRecommendQuestions = async (args: T.RecommendQuestionsRequest = {}) => {
//   return api
//     .get<T.RecommendQuestionsResponse>(endpoints.RECOMMEND_QUESTIONS, { params: args })
//     .then((d) => d.data)
// }

// export const getPopularQuestions = async (args: T.PopularQuestionsRequest = {}) => {
//   return api
//     .get<T.PopularQuestionsResponse>(endpoints.POPULAR_QUESTIONS, { params: args })
//     .then((d) => d.data)
// }

// export const getPopularStocks = async (args: T.PopularStocksRequest = {}) => {
//   return api
//     .get<T.PopularStocksResponse>(endpoints.POPULAR_STOCKS, { params: args })
//     .then((d) => d.data)
// }

export const getRecommendQuestions = async (
  args: T.RecommendQuestionsRequest = {},
): Promise<T.RecommendQuestionsResponse> => {
  // 서버 통신 대신 목 데이터 반환
  return Promise.resolve(mocks.RECOMMEND_QUESTIONS)
}

export const getPopularQuestions = async (
  args: T.PopularQuestionsRequest = {},
): Promise<T.PopularQuestionsResponse> => {
  // 서버 통신 대신 목 데이터 반환
  return Promise.resolve(mocks.POPULAR_QUESTIONS)
}

export const getPopularStocks = async (
  args: T.PopularStocksRequest = {},
): Promise<T.PopularStocksResponse> => {
  // 서버 통신 대신 목 데이터 반환
  return Promise.resolve(mocks.POPULAR_STOCKS)
}
