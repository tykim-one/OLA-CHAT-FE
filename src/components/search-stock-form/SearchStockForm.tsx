import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ReactCountryFlag from 'react-country-flag'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { useDebounceValue } from 'usehooks-ts'

import { useGetStockListQuery } from '@/hooks/data-fetching/stocks'

import { countryFlagEmojis } from '@/lib/locales'
import { cn } from '@/lib/utils'

import { SearchStockModel } from '@/types/stocks/model'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface SearchStockFormProps {
  defaultValue?: string
  selectedItem?: SearchStockModel
  onSelect?: (stock: SearchStockModel) => void
  placeholder?: string
  className?: string
  classNames?: {
    subButton?: string
    searchButton?: string
  }
  disabled?: boolean
  selectCommandKey?: string
  onRepeatSelectAction?: () => void
  /**
   * SearchStockForm이 활성화(입력창이 열림) 여부가 변경될 때 호출됩니다.
   * true  → 검색 입력창 활성화
   * false → 검색 입력창 비활성화
   */
  onActiveChange?: (active: boolean) => void
}

export const SearchStockFormBase = ({
  defaultValue = '',
  selectedItem,
  onSelect,
  placeholder = '종목명 또는 티커로 검색',
  className,
  classNames,
  disabled,
  selectCommandKey = 'enter',
  onRepeatSelectAction,
  onActiveChange,
}: SearchStockFormProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { watch, setValue, reset, register } = useForm<{ stockSearch: string }>({
    defaultValues: {
      stockSearch: defaultValue,
    },
  })
  const { ref, ...registerProps } = register('stockSearch', { required: true })

  const [searchValue] = useDebounceValue(watch('stockSearch'), 0)

  // 입력값 유무 판단 (순간값, 디바운스 이전에도 반영)
  const inputHasValue = !!watch('stockSearch')?.trim()

  const { data, isLoading, isFetching, isFetched } = useGetStockListQuery(
    { search: searchValue, limit: 20 },
    {
      staleTime: 1000,
      enabled: isInputVisible,
      queryKey: ['searchStocks', searchValue],
    },
  )

  const filteredSearchList = useMemo(() => {
    return data
  }, [data])

  const handleSelectStock = useCallback(
    (stock: SearchStockModel) => {
      onSelect?.(stock)
      setIsInputVisible(false)
      reset()
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      // 종목 선택 후 검색창 닫힘 상태를 부모에 알림은
      // isInputVisible 상태 변화를 감지하는 useEffect 로 대체되었습니다.
    },
    [onSelect, reset],
  )

  const handleToggleInput = useCallback(() => {
    setIsInputVisible((prev) => {
      const newState = !prev
      if (newState) {
        // input이 보여질 때 포커스를 설정
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      } else {
        setValue('stockSearch', '')
      }
      // 부모 컴포넌트에 활성화 상태 변경 알림은
      // isInputVisible 상태 변화를 감지하는 useEffect 로 대체되었습니다.
      return newState
    })
  }, [setValue, inputRef.current])

  const handleCloseSearch = useCallback(() => {
    setIsInputVisible(false)
    setValue('stockSearch', '')
    reset()
    // 부모 컴포넌트에 활성화 상태 변경 알림은
    // isInputVisible 상태 변화를 감지하는 useEffect 로 대체되었습니다.
  }, [setValue, reset])

  const searchingState = useMemo(() => isLoading || isFetching, [isLoading, isFetching])

  const initSearchState = useMemo(
    () => !filteredSearchList && !searchingState && !isFetched,
    [filteredSearchList, searchingState, isFetched],
  )

  const searchExistState = useMemo(
    () => !!filteredSearchList?.length && !searchingState && isFetched,
    [filteredSearchList, searchingState, isFetched],
  )

  const searchEmptyState = useMemo(
    () => !filteredSearchList?.length && !searchingState && isFetched,
    [filteredSearchList, searchingState, isFetched],
  )

  // isInputVisible 이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    onActiveChange?.(isInputVisible)
  }, [isInputVisible, onActiveChange])

  return (
    <div className={cn('relative w-full', className)}>
      {/* 검색 드롭다운 - 활성 상태일 때 위쪽에 표시 */}
      {isInputVisible && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-[#CBD5E1] rounded-lg shadow-lg min-h-[250px] overflow-hidden z-50">
          <div className="p-2 flex-shrink-0">
            {/* 선택된 종목 표시 영역 */}
            {selectedItem && (
              <div className="mb-3">
                <div className="flex items-center gap-2 bg-Grayscale-B25 rounded-md border p-2">
                  <div className="flex items-center gap-1 w-[67px]">
                    <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span className="text-slate-900 text-Pre-14-R">종목</span>
                  </div>
                </div>
                <div className="mt-2 p-2 border border-Grayscale-B50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-Grayscale-B900 text-Pre-14-B">{selectedItem.name}</span>
                      <Badge variant="outline" className="text-xs text-Grayscale-B600">
                        {selectedItem.ticker}
                      </Badge>
                      <span className="text-Pre-12-R">
                        <Flag countryCode={selectedItem.isoCode} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-Grayscale-B100 my-3" />
              </div>
            )}

            {/* 검색 안내 텍스트 */}

            {/* 검색 결과 목록 */}
            {!initSearchState && (
              <div className="max-h-[300px] overflow-y-auto">
                {searchingState && (
                  <div className="flex justify-center items-center py-4">
                    <span className="text-Grayscale-B200 text-Pre-14-R">Searching...</span>
                  </div>
                )}
                {searchEmptyState && (
                  <div className="flex justify-center items-center py-4">
                    <span className="text-Grayscale-B200 text-Pre-14-R">
                      No results found. Try different keywords or check your spelling.
                    </span>
                  </div>
                )}
                {searchExistState && (
                  <div className="space-y-1">
                    {filteredSearchList?.map((stock, i) => (
                      <div
                        key={stock.id}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-Grayscale-B50 transition-colors',
                          stock.id === selectedItem?.id ? 'bg-Grayscale-B50' : '',
                        )}
                        onClick={() => handleSelectStock(stock)}
                      >
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="text-slate-900 text-list">{stock.name}</span>
                          <Badge
                            variant="default"
                            className="text-tableItemSmall text-slate-400 px-0"
                          >
                            {stock.ticker}
                          </Badge>
                          <span className="text-tableItemSmall">
                            <Flag countryCode={stock.isoCode} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {!isInputVisible ? (
        // 비활성 상태: 종목 버튼만 표시
        <Button
          onClick={handleToggleInput}
          variant="outline"
          className="flex items-center gap-1.5 bg-white border border-[#CBD5E1] rounded-md hover:bg-Grayscale-B25 transition-colors h-auto"
          disabled={disabled}
        >
          <Image src="/input-search.svg" alt="search" width={20} height={20} />
          <span className="text-Grayscale-B900 text-Pre-14-R">종목</span>
        </Button>
      ) : (
        // 활성 상태: ModernChatInput 위치에 완전히 겹치는 오버레이
        <div className="flex gap-3">
          {/* 닫기 버튼 - 종목 버튼 자리에 표시 */}
          <Button
            onClick={handleCloseSearch}
            className={cn(
              "bg-slate-600 flex items-center gap-2 p-2 text-white rounded-md hover:bg-Grayscale-B700 transition-colors h-auto",
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-white text-Pre-14-R">닫기</span>
          </Button>

          {/* ModernChatInput 위치에 완전히 겹치는 입력창 */}
          <div className="flex-1 min-w-0">
            {/* ModernChatInput과 동일한 크기로 완전히 대체 */}
            <div className="flex flex-col w-full gap-1.5">
              <div className="flex w-full">
                <div className="flex w-full rounded-md transition-all duration-200 border-slate-400">
                  <div className="flex items-center justify-between w-full px-3 py-2 bg-white border border-slate-300 rounded-md">
                    {/* 입력 필드 */}
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        {...registerProps}
                        ref={(el) => {
                          ref(el)
                          inputRef.current = el
                        }}
                        placeholder={placeholder}
                        className="flex-1 text-sm font-normal bg-transparent border-none outline-none placeholder-slate-400"
                        onChange={(e) => setValue('stockSearch', e.target.value)}
                      />
                    </div>

                    {/* 전송 버튼 - ModernChatInput과 완전히 동일 */}
                    <button
                      type="button"
                      className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-200 bg-transparent"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.05389 2.8961C2.23334 2.71302 2.50608 2.65798 2.74237 2.75743L18.5754 9.42442C18.807 9.52195 18.958 9.74831 18.9582 9.99962C18.9582 10.2511 18.8071 10.4782 18.5754 10.5758L2.74237 17.2428C2.50614 17.3422 2.23332 17.2871 2.05389 17.1041C1.8745 16.921 1.82474 16.6469 1.92889 16.4127L4.50604 10.6246H10.8332C11.1784 10.6246 11.4582 10.3448 11.4582 9.99962C11.458 9.65461 11.1782 9.37462 10.8332 9.37462H4.50604L1.92889 3.58751C1.82465 3.35327 1.87445 3.07924 2.05389 2.8961Z"
                          fill={inputHasValue ? '#6366F1' : '#E2E8F0'}
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export interface FlagProps {
  countryCode: string
}

export const Flag = ({ countryCode }: FlagProps) => {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return countryFlagEmojis[countryCode]
  }

  return (
    <ReactCountryFlag
      countryCode={(countryCode || '').toUpperCase()}
      svg
      onError={() => setErrored(true)}
    />
  )
}

export type StockItemProps = SearchStockModel
export const StockItem = ({ name, ticker, isoCode }: StockItemProps) => {
  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-Grayscale-B900 text-Pre-14-B">{name}</span>
      <Badge variant="outline" className="text-xs text-Grayscale-B600">
        {ticker}
      </Badge>
      <span className="text-Pre-12-R">
        <Flag countryCode={isoCode} />
      </span>
    </div>
  )
}

export const SearchStockForm = (props: SearchStockFormProps) => {
  return (
    <ErrorBoundary FallbackComponent={() => <>Error</>}>
      <SearchStockFormBase {...props} />
    </ErrorBoundary>
  )
}
