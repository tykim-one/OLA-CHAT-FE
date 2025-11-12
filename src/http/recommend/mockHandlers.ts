import { HttpResponse, http } from 'msw'

import { endpoints } from './endpoints'
import { mocks } from './mocks'

export const handlers = [
  http.get(endpoints.RECOMMEND_QUESTIONS, () => {
    return HttpResponse.json(mocks.RECOMMEND_QUESTIONS)
  }),
  http.get(endpoints.POPULAR_QUESTIONS, () => {
    return HttpResponse.json(mocks.POPULAR_QUESTIONS)
  }),
  http.get(endpoints.POPULAR_STOCKS, () => {
    return HttpResponse.json(mocks.POPULAR_STOCKS)
  }),
]
