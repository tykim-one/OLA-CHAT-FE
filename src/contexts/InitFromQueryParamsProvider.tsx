'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

// dayjs UTC 플러그인 활성화
dayjs.extend(utc)

interface InitFromQueryParamsContextType {
  queryParams: { mts: string | number | null, auth: string | number | null, encData: string | null, initialPrompt: string | null } | null
  isInitialized: boolean
  isInitializing: boolean
}

const InitFromQueryParamsContext = createContext<InitFromQueryParamsContextType | undefined>(undefined)

interface InitFromQueryParamsProviderProps {
  children: ReactNode
}

// 로딩 컴포넌트
function QueryParamsLoading() {
  return null
}

// useSearchParams를 사용하는 기본 Provider
export function InitFromQueryParamsProviderBase({ children }: InitFromQueryParamsProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [queryParams, setQueryParams] = useState<InitFromQueryParamsContextType['queryParams'] | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    // 이미 초기화되었거나 초기화 중인 경우 중복 실행 방지
    if (isInitialized || isInitializing) {
      return
    }

    setIsInitializing(true)

    // 1. 쿼리 파라미터에서 데이터 추출
    const authParam = searchParams.get('auth')
    const encDataParam = searchParams.get('encData')
    const mtsParam = searchParams.get('MTS')
    const initialPromptParam = searchParams.get('initialPrompt')

    // 2. auth 유효성 검사
    if (!authParam) {
      router.push('/401')
      setIsInitializing(false)
      return
    }

    // 내부 접속을 위한 ola-ola 허용
    if (authParam === 'ola-ola') {
      setQueryParams({ 
        mts: 'ola', 
        auth: dayjs().utc().valueOf(),
        encData: 'ola', 
        initialPrompt: initialPromptParam ? `${initialPromptParam} 종합적으로 분석해줘` : null
      })
      setIsInitialized(true)
      setIsInitializing(false)
      return
    }

    // 일반적인 timestamp 검증
    const authTimestamp = parseInt(authParam, 10)
    if (isNaN(authTimestamp)) {
      router.push('/401')
      setIsInitializing(false)
      return
    }

    // UTC 기준으로 현재 시간과 비교하여 10분 이내인지 검사
    const currentTime = dayjs.utc()
    const authTime = dayjs.utc(authTimestamp)
    const timeDifference = currentTime.diff(authTime, 'minute')

    if (timeDifference > 10 || timeDifference < 0) {
      router.push('/401')
      setIsInitializing(false)
      return
    }

    // 3. encData 유효성 검사
    if (!encDataParam) {
      router.push('/401')
      setIsInitializing(false)
      return
    }

    // 4. 유효성 검사 통과 시 상태 업데이트
    setQueryParams({ 
      mts: mtsParam, 
      auth: authParam, 
      encData: encDataParam, 
      initialPrompt: initialPromptParam ? `${initialPromptParam} 종합적으로 분석해줘` : null
    })
    setIsInitialized(true)
    setIsInitializing(false)

  }, [searchParams, router, isInitialized, isInitializing])

  const value: InitFromQueryParamsContextType = {
    queryParams,
    isInitialized,
    isInitializing,
  }

  return (
    <InitFromQueryParamsContext.Provider value={value}>
      {children}
    </InitFromQueryParamsContext.Provider>
  )
}

// Suspense로 감싼 메인 Provider
export function InitFromQueryParamsProvider({ children }: InitFromQueryParamsProviderProps) {
  return (
    <Suspense fallback={<QueryParamsLoading />}>
      <InitFromQueryParamsProviderBase>
        {children}
      </InitFromQueryParamsProviderBase>
    </Suspense>
  )
}

export function useInitFromQueryParams() {
  const context = useContext(InitFromQueryParamsContext)
  if (context === undefined) {
    throw new Error('useInitFromQueryParams must be used within an InitFromQueryParamsProvider')
  }
  return context
}
