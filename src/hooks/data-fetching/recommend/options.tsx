import { UseQueryOptions } from '@tanstack/react-query'

import { Question, Stock } from '@/types/recommend/model'

import * as api from '@/http/recommend/api'

import { keys } from './keys'
import { transformQuestionDTO, transformStockDTO } from './transforms'

export type RecommendQuestionsQueryOptions = Partial<UseQueryOptions<Question[]>>
export type PopularQuestionsQueryOptions = Partial<UseQueryOptions<Question[]>>
export type PopularStocksQueryOptions = Partial<UseQueryOptions<Stock[]>>

export const getRecommendQuestionsQueryOptions = (options?: RecommendQuestionsQueryOptions) => ({
  ...options,
  queryKey: keys.GET_RECOMMEND_QUESTIONS(),
  queryFn: async () => {
    await Promise.resolve()
    const response = await api.getRecommendQuestions()
    return response.data.map(transformQuestionDTO)
  },
})

export const getPopularQuestionsQueryOptions = (options?: PopularQuestionsQueryOptions) => ({
  ...options,
  queryKey: keys.GET_POPULAR_QUESTIONS(),
  queryFn: async () => {
    await Promise.resolve()
    const response = await api.getPopularQuestions()
    return response.data.map(transformQuestionDTO)
  },
})

export const getPopularStocksQueryOptions = (options?: PopularStocksQueryOptions) => ({
  ...options,
  queryKey: keys.GET_POPULAR_STOCKS(),
  queryFn: async () => {
    await Promise.resolve()
    const response = await api.getPopularStocks()
    return response.data.map(transformStockDTO)
  },
})
