import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatClient, extractDisclosureData } from '@/lib/chatClient'

import {
  ChatContainerState,
  ModernChatMessage,
  ModernChatState,
  UseChatContainerProps,
} from '@/types/modern-chat'

/**
 * 모던 채팅 컨테이너의 상태와 로직을 관리하는 커스텀 훅
 * Figma 디자인의 모든 채팅 상태를 관리하며 실제 API 연동
 */
export function useChatContainer({
  initialState = 'idle',
  welcomeConfig,
  recommendedConfig,
  apiEndpoint,
  initialMessage,

  onDisclosureDataUpdate,
}: UseChatContainerProps & {
  initialMessage?: string
  onDisclosureViewClick?: () => void
  onDisclosureDataUpdate?: (data: string[]) => void
} = {}) {
  // 상태 관리
  const [state, setState] = useState<ChatContainerState>({
    current: initialState,
    messages: [],
    inputValue: '',
    activeTab: recommendedConfig?.tabs?.[0]?.id || 'recommended',
    isLoading: false,
    error: null,
  })

  // ChatClient 인스턴스 생성
  const chatClient = useRef<ChatClient>(new ChatClient())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<string | null>(null)

  // 채팅 초기화
  useEffect(() => {
    initializeChat()
  }, [])

  // 초기 메시지 처리
  useEffect(() => {
    if (initialMessage && state.messages.length === 0 && sessionId) {
      handleInitialMessage()
    }
  }, [initialMessage, state.messages.length, sessionId])

  /**
   * 채팅 초기화 함수
   */
  const initializeChat = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      // 기존 세션 확인
      const existingSessionId = chatClient.current.getSessionId()

      if (existingSessionId) {
        // 기존 세션의 히스토리 불러오기
        const history = await chatClient.current.getHistory()
        const modernMessages = history.map((msg) => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          role: msg.role,
          timestamp: msg.timestamp,
          // type: msg.role === 'user' ? ('query' as const) : ('answer' as const),
        })) as ModernChatMessage[]

        setState((prev) => ({
          ...prev,
          messages: modernMessages,
          isLoading: false,
        }))
        setSessionId(existingSessionId)
      } else {
        // 새 세션 생성
        const newSessionId = await chatClient.current.createSession()
        setSessionId(newSessionId)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('채팅 초기화 실패:', error)
      setState((prev) => ({
        ...prev,
        error: '채팅을 초기화하는 중 오류가 발생했습니다.',
        isLoading: false,
      }))
    }
  }

  /**
   * 초기 메시지 처리 함수
   */
  const handleInitialMessage = async () => {
    if (!initialMessage) return

    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      // 초기 사용자 메시지 추가
      const userMessage: ModernChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        type: 'text',
        content: initialMessage,
        timestamp: new Date(),
      }
      setState((prev) => ({ ...prev, messages: [userMessage] }))

      // AI 응답을 위한 빈 메시지 생성
      const aiMessage: ModernChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        type: 'text',
      }
      setState((prev) => ({ ...prev, messages: [...prev.messages, aiMessage] }))

      // 스트리밍 방식으로 AI 응답 받기
      await chatClient.current.sendMessageStream(initialMessage, (data) => {
        if (typeof data === 'object' && data !== null) {
          const typedData = data as any
          setLoadingState(typedData.step || '')

          // 실제 서버 응답 형식에 맞게 처리
          if (typedData.step === 'format_answer') {
            // 완료된 결과 처리
            const resultContent =
              typeof typedData.result === 'string'
                ? typedData.result
                : JSON.stringify(typedData.result, null, 2)

            setState((prev) => {
              const updated = [...prev.messages]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: resultContent,
                }
              }
              return { ...prev, messages: updated }
            })
          } else if (typedData.type && typedData.type !== 'final_answer') {
            // 중간 단계 처리 (진행 상황 표시)
            const progressContent = `처리 중... (${typedData.data?.step || typedData.step})`

            setState((prev) => {
              const updated = [...prev.messages]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  type: 'text',
                  content: progressContent,
                }
              }
              return { ...prev, messages: updated }
            })
          } else if (typedData.content || typedData.delta || typedData.text) {
            // 기존 형식 지원 (호환성 유지)
            const newContent = typedData.content || typedData.delta || typedData.text
            setState((prev) => {
              const updated = [...prev.messages]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: updated[lastIndex].content + newContent,
                }
              }
              return { ...prev, messages: updated }
            })
          }
        }
      })
    } catch (error) {
      console.error('초기 메시지 처리 실패:', error)
      setState((prev) => ({
        ...prev,
        error: '초기 메시지 처리 중 오류가 발생했습니다.',
        isLoading: false,
      }))
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // 입력값 변경 핸들러
  const setInputValue = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      inputValue: value,
      current: value.length > 0 ? 'user_typing' : 'idle',
    }))
  }, [])

  // 메시지 전송 핸들러
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isLoading || !sessionId) return

      const userMessage = message.trim()
      setState((prev) => ({
        ...prev,
        inputValue: '',
        isLoading: true,
        error: null,
        current: 'message_sending',
      }))

      try {
        // 사용자 메시지 즉시 화면에 표시
        const newUserMessage: ModernChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
          type: 'text',
          // type: 'query',
        }
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, newUserMessage],
          current: 'ai_loading',
        }))

        // AI 응답을 위한 빈 메시지 생성
        const aiMessage: ModernChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          type: 'text',
          // type: 'answer',
        }
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
        }))

        // 스트리밍 방식으로 AI 응답 받기
        await chatClient.current.sendMessageStream(userMessage, (data) => {
          if (typeof data === 'object' && data !== null) {
            const typedData = data as any

            // 완료 상태 체크
            const isCompleted =
              typedData.type === 'run_finished' || typedData.type === 'final_answer'

            // 최종 결과 처리
            if (typedData.type === 'final_answer') {
              const resultContent = typedData.final_answer
              setState((prev) => {
                const updated = [...prev.messages]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: resultContent,
                  }
                }
                return { ...prev, messages: updated }
              })
            }
            // 공시 데이터 추출 및 콜백 호출
            else if (typedData.step === 'dart_rcept_no_parser_node') {
              try {
                const disclosureData = extractDisclosureData(data)
                if (disclosureData.length > 0) {
                  onDisclosureDataUpdate?.(disclosureData)
                }
              } catch (error) {}
            } else if (typedData.step === 'unsupported_question') {
              const unsupportedQuestion = typedData.output.final_answer
              setState((prev) => {
                const updated = [...prev.messages]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: unsupportedQuestion,
                  }
                }
                return { ...prev, messages: updated }
              })
            } else {
              // 진행 중 단계 처리
              let step = typedData.data?.step || typedData.step

              // 진행 상황이 있으면 표시
              if (step && !isCompleted) {
                const progressContent = `처리 중... (${step})`

                setState((prev) => {
                  const updated = [...prev.messages]
                  const lastIndex = updated.length - 1
                  if (updated[lastIndex]?.role === 'assistant') {
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      type: 'text',
                      content: progressContent,
                    }
                  }
                  return { ...prev, messages: updated }
                })
              }

              // 일반 콘텐츠 처리
              if (typedData.content) {
                setState((prev) => {
                  const updated = [...prev.messages]
                  const lastIndex = updated.length - 1
                  if (updated[lastIndex]?.role === 'assistant') {
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      content: typedData.content || '',
                    }
                  }
                  return { ...prev, messages: updated }
                })
              }
            }
          }
        })

        // 응답 완료 후 idle 상태로 복귀
        setTimeout(() => {
          setState((prev) => ({ ...prev, current: 'idle' }))
        }, 1000)
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
          isLoading: false,
        }))

        // 실패한 경우 사용자 메시지를 다시 입력창에 복원
        setState((prev) => ({ ...prev, inputValue: userMessage }))
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    },
    [state.isLoading, sessionId, onDisclosureDataUpdate],
  )

  // 추천 질문 클릭 핸들러
  const handleQuestionClick = useCallback(
    (question: string) => {
      sendMessage(question)
    },
    [sendMessage],
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
    setState((prev) => ({
      ...prev,
      error: null,
    }))
  }, [])

  // 채팅 초기화
  const resetChat = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const newSessionId = await chatClient.current.startNewChat()
      setSessionId(newSessionId)

      setState({
        current: 'idle',
        messages: [],
        inputValue: '',
        activeTab: recommendedConfig?.tabs?.[0]?.id || 'recommended',
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '새 채팅을 시작하는 중 오류가 발생했습니다.',
        isLoading: false,
      }))
    }
  }, [recommendedConfig])

  return {
    // 상태
    chatState: state.current,
    messages: state.messages,
    inputValue: state.inputValue,
    activeTab: state.activeTab,
    isLoading: state.isLoading,
    error: state.error,
    sessionId,
    loadingState,

    // 액션
    sendMessage,
    handleQuestionClick,
    handleTabChange,
    setInputValue,
    clearError,
    resetChat,
  }
}
