import { Question, Stock } from '@/types/recommend/model'

import { QuestionDto, StockDto } from '@/http/recommend/types'

export const transformQuestionDTO = (questionDTO: QuestionDto): Question => ({
  id: questionDTO.id,
  text: questionDTO.text,
})

export const transformQuestionModel = (question: Question): QuestionDto => ({
  id: question.id,
  text: question.text,
})

export const transformStockDTO = (stockDTO: StockDto): Stock => ({
  id: stockDTO.id,
  name: stockDTO.name,
  ticker: stockDTO.ticker,
})

export const transformStockModel = (stock: Stock): StockDto => ({
  id: stock.id,
  name: stock.name,
  ticker: stock.ticker,
})
