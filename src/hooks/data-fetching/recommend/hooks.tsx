import { useIsMutating, useQuery } from '@tanstack/react-query'

import { keys } from './keys'
import {
  PopularQuestionsQueryOptions,
  PopularStocksQueryOptions,
  RecommendQuestionsQueryOptions,
  getPopularQuestionsQueryOptions,
  getPopularStocksQueryOptions,
  getRecommendQuestionsQueryOptions,
} from './options'

export const useGetRecommendQuestionsQuery = (options?: RecommendQuestionsQueryOptions) => {
  return useQuery(getRecommendQuestionsQueryOptions(options))
}

export const useGetPopularQuestionsQuery = (options?: PopularQuestionsQueryOptions) => {
  return useQuery(getPopularQuestionsQueryOptions(options))
}

export const useGetPopularStocksQuery = (options?: PopularStocksQueryOptions) => {
  return useQuery(getPopularStocksQueryOptions(options))
}
