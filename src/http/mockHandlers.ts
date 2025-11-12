import { handlers as datasetHandlers } from './dataset/mockHandlers'
import { handlers as recommendHandlers } from './recommend/mockHandlers'
import { handlers as stocksHandlers } from './stocks/mockHandlers'

export const handlers = [...datasetHandlers, ...recommendHandlers, ...stocksHandlers]
