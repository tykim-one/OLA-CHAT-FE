import { useCallback, useEffect, useState } from 'react'

import { useChatViewModel } from '@/hooks/chat/useChatViewModel'
// Query Hook들 import
import {
  useGetPopularQuestionsQuery,
  useGetPopularStocksQuery,
  useGetRecommendQuestionsQuery,
} from '@/hooks/data-fetching/recommend/hooks'

import {
  ChatContainerState,
  ModernChatMessage,
  ModernChatState,
  UseChatContainerProps,
  UseChatContainerReturn,
} from '@/types/modern-chat'
// 타입 import
import { QuestionItem } from '@/types/question/question'

/**
 * 모던 채팅 컨테이너의 상태와 로직을 관리하는 커스텀 훅
 * Figma 디자인의 모든 채팅 상태를 관리
 */
export function useChatContainer({
  initialState = 'idle',
  welcomeConfig,
  recommendedConfig,
  apiEndpoint,
  initialMessage,
  initialPrompt,
}: UseChatContainerProps = {}) {
  // 실제 API와 연동하는 ViewModel 사용
  const chatViewModel = useChatViewModel({ initialMessage })

  // Query Hook들을 사용하여 데이터 가져오기
  const {
    data: recommendQuestionsData,
    isLoading: isRecommendQuestionsLoading,
    error: recommendQuestionsError,
  } = useGetRecommendQuestionsQuery()

  const {
    data: popularQuestionsData,
    isLoading: isPopularQuestionsLoading,
    error: popularQuestionsError,
  } = useGetPopularQuestionsQuery()

  const {
    data: popularStocksData,
    isLoading: isPopularStocksLoading,
    error: popularStocksError,
  } = useGetPopularStocksQuery()

  // UI 상태 관리
  const [state, setState] = useState<ChatContainerState>({
    current: initialState,
    messages: [],
    inputValue: '',
    activeTab: recommendedConfig?.tabs?.[0]?.id || 'recommended',
    isLoading: false,
    error: null,
  })
  const [hasSentInitialMessage, setHasSentInitialMessage] = useState<boolean>(false)

  // 추천 질문 데이터 변환 함수
  const transformRecommendQuestions = useCallback((data: any): QuestionItem[] => {
    if (!data) return []

    return data.map((item: any, index: number) => ({
      id: item.id || String(index + 1),
      text: item.text,
      category: 'recommended' as const, // API에서 category가 없으므로 하드코딩
      hasArrow: true,
    }))
  }, [])

  // 인기 질문 데이터 변환 함수
  const transformPopularQuestions = useCallback((data: any): QuestionItem[] => {
    if (!data) return []

    return data.map((item: any, index: number) => ({
      id: item.id || String(index + 1),
      text: item.text,
      category: 'popular' as const, // API에서 category가 없으므로 하드코딩
      hasArrow: true,
    }))
  }, [])

  // 인기 종목 데이터 변환 함수
  const transformPopularStocks = useCallback((data: any): any[] => {
    if (!data) return []

    return data.map((item: any, index: number) => ({
      id: item.id || String(index + 1),
      name: item.name,
      ticker: item.ticker,
      iconUrl: `/${item.id}.png`, // 기본 아이콘 경로
    }))
  }, [])

  // 현재 활성 탭에 따른 질문들 필터링
  const getFilteredQuestions = useCallback(
    (activeTab: string): QuestionItem[] => {
      switch (activeTab) {
        case 'recommended':
          return transformRecommendQuestions(recommendQuestionsData)
        case 'popular':
          return transformPopularQuestions(popularQuestionsData)
        default:
          return []
      }
    },
    [
      recommendQuestionsData,
      popularQuestionsData,
      transformRecommendQuestions,
      transformPopularQuestions,
    ],
  )

  // 현재 활성 탭에 따른 종목들 반환
  const getFilteredStocks = useCallback((): any[] => {
    if (state.activeTab === 'stocks') {
      return transformPopularStocks(popularStocksData)
    }
    return []
  }, [state.activeTab, popularStocksData, transformPopularStocks])

  // 데이터 로딩 상태 통합
  const isDataLoading =
    isRecommendQuestionsLoading || isPopularQuestionsLoading || isPopularStocksLoading

  // 데이터 에러 통합
  const dataError = recommendQuestionsError || popularQuestionsError || popularStocksError

  // ViewModel의 상태 변화를 UI 상태에 반영
  useEffect(() => {
    const mappedMessages = chatViewModel.messages.map((msg, index) => {
      const mappedMsg = {
        id: msg.id,
        type: msg.type,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp,
        // type: msg.role === 'user' ? ('query' as const) : ('answer' as const), // ModernChatMessage 타입에 맞게 수정
      }
      return mappedMsg
    }) as ModernChatMessage[]

    setState((prev) => {
      // isLoading 상태에 따라 chatState도 업데이트
      let newChatState = prev.current

      if (chatViewModel.isLoading) {
        // 로딩 중일 때: message_sending이 아니면 ai_loading으로 변경
        if (prev.current !== 'message_sending') {
          newChatState = 'ai_loading'
        }
        // message_sending 상태는 유지 (사용자가 입력한 직후의 상태)
      } else {
        // 로딩이 끝났을 때: ai_loading이나 message_sending 모두 idle로 변경
        if (prev.current === 'ai_loading' || prev.current === 'message_sending') {
          newChatState = 'idle'
        }
      }

      const newState = {
        ...prev,
        current: newChatState,
        messages: mappedMessages,
        isLoading: chatViewModel.isLoading,
        error: chatViewModel.error,
      }
      return newState
    })
  }, [chatViewModel.messages, chatViewModel.isLoading, chatViewModel.error])

  // 채팅 초기화 - 컴포넌트 마운트 시 즉시 실행
  useEffect(() => {
    chatViewModel.initializeChat()
  }, []) // 빈 의존성 배열로 한 번만 실행

  // 입력값 변경 핸들러
  const setInputValue = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      inputValue: value,
      current: value.length > 0 ? 'user_typing' : 'idle',
    }))
  }, [])

  // 메시지 전송 핸들러 (실제 API 사용)
  const sendMessage = useCallback(
    async (message: string) => {
      // 호출 스택 정보 출력
      if (!message.trim()) {
        return
      }

      if (chatViewModel.isLoading) {
        return
      }

      if (!chatViewModel.sessionId) {
        return
      }

      // 입력값 초기화
      setState((prev) => ({
        ...prev,
        inputValue: '',
        current: 'message_sending',
      }))

      // 실제 API를 통해 메시지 전송
      await chatViewModel.sendMessage(message)
    },
    [chatViewModel.isLoading, chatViewModel.sessionId, chatViewModel.sendMessage],
  )

  // 추천 질문 클릭 핸들러
  const handleQuestionClick = useCallback(
    (question: string) => {
      // sendMessage를 직접 호출하지 않고 조건을 먼저 체크
      if (!question.trim()) {
        return
      }

      if (chatViewModel.isLoading) {
        return
      }

      if (!chatViewModel.sessionId) {
        return
      }

      sendMessage(question)
    },
    [sendMessage, chatViewModel.isLoading, chatViewModel.sessionId],
  )

  // 쿼리파라미터 초기 프롬프트 핸들러
  const handleInitialPrompt = useCallback(
    (initialPrompt: string) => {
      // sendMessage를 직접 호출하지 않고 조건을 먼저 체크
      if (!initialPrompt.trim()) {
        return
      }

      if (chatViewModel.isLoading) {
        return
      }

      if (!chatViewModel.sessionId) {
        return
      }

      sendMessage(initialPrompt)

      setHasSentInitialMessage(true)
    },
    [sendMessage, chatViewModel.isLoading, chatViewModel.sessionId],
  )

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: string) => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
    }))
  }, [])

  // 에러 해제 핸들러
  const clearError = useCallback(() => {
    chatViewModel.clearError()
  }, [chatViewModel.clearError])

  // 채팅 초기화
  const resetChat = useCallback(async () => {
    await chatViewModel.startNewChat()
    setState((prev) => ({
      ...prev,
      current: 'idle',
      inputValue: '',
      activeTab: recommendedConfig?.tabs?.[0]?.id || 'recommended',
      error: null,
    }))
  }, [chatViewModel.startNewChat, recommendedConfig?.tabs])

  // 스트림 중단 함수 추가
  const abortCurrentMessage = useCallback(() => {
    if (chatViewModel.isLoading) {
      // ViewModel에 중단 기능이 있다면 호출
      if (typeof chatViewModel.abortCurrentStream === 'function') {
        chatViewModel.abortCurrentStream()
      }

      setState((prev) => ({
        ...prev,
        current: 'idle',
        isLoading: false,
      }))
    }
  }, [chatViewModel.isLoading, chatViewModel.abortCurrentStream])

  // 초기 프롬프트 설정
  useEffect(() => {
    if (initialPrompt && !hasSentInitialMessage) {
      handleInitialPrompt(initialPrompt)
    }
  },[initialPrompt, handleInitialPrompt, hasSentInitialMessage])

  return {
    // 상태
    chatState: state.current,
    messages: state.messages,
    inputValue: state.inputValue,
    activeTab: state.activeTab,
    isLoading: state.isLoading || isDataLoading,
    error: state.error || dataError?.message || null,
    sessionId: chatViewModel.sessionId,
    loadingState: chatViewModel.loadingState,

    // 데이터
    filteredQuestions: getFilteredQuestions(state.activeTab),
    filteredStocks: getFilteredStocks(),

    // 액션
    sendMessage,
    handleQuestionClick,
    handleTabChange,
    setInputValue,
    clearError,
    resetChat,
    abortCurrentMessage, // 새로운 중단 함수 추가
  }
}
