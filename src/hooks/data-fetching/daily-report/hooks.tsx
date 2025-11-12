import { useQuery } from '@tanstack/react-query'

import { DailyReportTheme } from '@/services/daily-report/types'

import {
  GetDailyReportQueryOptions,
  GetDailyReportsByThemeQueryOptions,
  getDailyReportQueryOptions,
  getDailyReportsByThemeQueryOptions,
} from './options'
import { GetDailyReportRequestModel, GetDailyReportsByThemeRequestModel } from './transforms'

export const useGetDailyReportQuery = (
  request: GetDailyReportRequestModel,
  options?: GetDailyReportQueryOptions,
) => {
  return useQuery(getDailyReportQueryOptions(request, options))
}

export const useGetDailyReportsByThemeQuery = (
  request: GetDailyReportsByThemeRequestModel,
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return useQuery(getDailyReportsByThemeQueryOptions(request, options))
}

export const useGetExchangeDailyReportsQuery = (
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return useGetDailyReportsByThemeQuery({ theme: 'FOREX' }, options)
}

export const useGetAiDailyReportsQuery = (
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return useGetDailyReportsByThemeQuery({ theme: 'AI' }, options)
}

export const useGetDividendDailyReportsQuery = (
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return useGetDailyReportsByThemeQuery({ theme: 'DIVIDEND' }, options)
}

export const useGetStockDailyReportsQuery = (
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return useGetDailyReportsByThemeQuery({ theme: 'GENERAL' }, options)
}

export const useGetDailyReportsByThemesQuery = (
  themes: DailyReportTheme[],
  options?: GetDailyReportsByThemeQueryOptions,
) => {
  return themes.map((theme) => useGetDailyReportsByThemeQuery({ theme }, options))
}

