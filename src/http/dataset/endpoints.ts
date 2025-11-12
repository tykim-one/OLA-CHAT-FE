export const endpointParams = {
  dataset_type: ':dataset_type',
}

export const endpoints = {
  FETCH_CONTENT_DATASETS: `/api/ibk_securities/dataset/${endpointParams.dataset_type}`,
} as const

export type EndpointKey = keyof typeof endpoints
