import { HttpResponse, http } from 'msw'

import { endpoints } from './endpoints'
import { mocks } from './mocks'

export const handlers = [
  http.post(endpoints.FETCH_CONTENT_DATASETS, () => {
    return HttpResponse.json(mocks.DATASET)
  }),
]
