import { HttpResponse, http } from 'msw'

import { endpoints } from './endpoints'
import { mocks } from './mocks'

export const handlers = [
  http.get(endpoints.STOCKS_SEARCH, () => {
    return HttpResponse.json(mocks.STOCKS_SEARCH)
  }),
]
