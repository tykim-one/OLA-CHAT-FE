'use client'

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'

import { simpleEncrypt } from '@/lib/simpleEncrypt'

import { DataSetModel, DataSetQueryModel, ExtractDataSetField } from '@/types/dataset'

import * as dataSetApi from '@/http/dataset/api'

import { queryKeys } from './keys'
import { transformDataSetDTO, transformDataSetQueryModel } from './transform'

export type ContentDataSetQueryOptions<T extends DataSetQueryModel = DataSetQueryModel> = Partial<
  UseQueryOptions<
    DataSetModel<ExtractDataSetField<T>>[],
    Error,
    DataSetModel<ExtractDataSetField<T>>[]
  >
>

export type ContentDataSetQueryResult<T extends DataSetQueryModel = DataSetQueryModel> =
  UseQueryResult<DataSetModel<ExtractDataSetField<T>>[], Error>

export const useContentDataSetQuery = <T extends DataSetQueryModel = DataSetQueryModel>(
  dataSetQueries?: T[],
  options?: ContentDataSetQueryOptions<T>,
) => {
  const { queryKey = [], ...restOptions } = options || {}

  return useQuery({
    queryKey: [...queryKeys.DATA_SET_QUERY(), ...queryKey],
    queryFn: async () => {
      await Promise.resolve()

      try {
        const response = await Promise.all(
          dataSetQueries!.map((dataSetQuery) => {
            return dataSetApi
              .fetchContentDataSets(simpleEncrypt(transformDataSetQueryModel(dataSetQuery!)))
              .then((d) => transformDataSetDTO<T>(d.data))
          }),
        )

        return response
      } catch {
        return null as any
      }
    },
    retry: false,
    ...restOptions,
  })
}
