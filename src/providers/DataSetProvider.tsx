import {
  PropsWithChildren,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import {
  ContentDataSetQueryOptions,
  ContentDataSetQueryResult,
  useContentDataSetQuery,
} from '@/hooks/data-fetching/dataset'

import { truncateDecimalValues } from '@/lib/object'

import { DataSetModel, DataSetQueryModel, ExtractDataSetField } from '@/types/dataset'

export type DataSetProviderContextType<T extends DataSetQueryModel = DataSetQueryModel> = Pick<
  ContentDataSetQueryResult<T>,
  'data' | 'isLoading' | 'isFetching' | 'isFetched' | 'isError'
> & {
  fetchDataSet: () => void
}

const DataSetProviderContext = createContext<
  DataSetProviderContextType<DataSetQueryModel> | undefined
>(undefined)

export type DataSetProviderProps<T extends DataSetQueryModel = DataSetQueryModel> = {
  dataSetQueries?: T[]
  options?: ContentDataSetQueryOptions<T>
  onSuccess?: (data: DataSetModel<ExtractDataSetField<T>>[] | undefined) => void
  errorNode?: ReactNode
  disabled?: boolean
}
export const DataSetProvider = <T extends DataSetQueryModel = DataSetQueryModel>({
  children,
  dataSetQueries,
  options,
  onSuccess,
  errorNode,
  disabled,
}: PropsWithChildren<DataSetProviderProps<T>>) => {
  const { isError, isLoading, isFetched, isFetching, refetch, data } = useContentDataSetQuery<T>(
    dataSetQueries,
    options
  )
  const prevDataSetQueries = useRef<T[] | undefined>(undefined)
  const isDataSetQueriesChanged = useRef(false)

  const value = useMemo<DataSetProviderContextType<T>>(() => {
    return {
      data: data?.map((dataSet) => ({
        ...dataSet,
        rows: dataSet.rows.map((row) => truncateDecimalValues(row)),
      })),
      isLoading: isFetching || isLoading,
      isError,
      isFetched,
      isFetching,
      fetchDataSet: () => {
        refetch()
      },
    }
  }, [isError, data, isFetched, isFetching, isLoading, refetch])

  useEffect(() => {
    if (disabled || !dataSetQueries || !options) return
    if (options.enabled) return

    refetch()
  }, [dataSetQueries, options, disabled])

  useEffect(() => {
    if (disabled || !data) return
    if (!isDataSetQueriesChanged.current) return

    onSuccess?.(data)
  }, [data])

  useEffect(() => {
    isDataSetQueriesChanged.current =
      JSON.stringify(prevDataSetQueries.current) !== JSON.stringify(dataSetQueries)
    prevDataSetQueries.current = dataSetQueries
  }, [dataSetQueries])

  if ((!isFetching && isFetched && !data) || isError) {
    if (isValidElement(errorNode)) {
      return cloneElement(errorNode, {
        handleRetry: () => {
          refetch()
        },
      } as any)
    }
  }
  
  return (
    <DataSetProviderContext.Provider value={value as DataSetProviderContextType<DataSetQueryModel>}>
      {children}
    </DataSetProviderContext.Provider>
  )
}

export const useDataSetProvider = () => {
  const context = useContext(DataSetProviderContext)
  if (context === undefined) {
    throw new Error('useDataSetProvider must be used within a DataSetProviderProvider')
  }

  return context
}
