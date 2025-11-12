import { useEffect, useRef, useState } from 'react'

import { ChatClient } from '@/lib/chatClient'

import { ChatMessage } from '@/types/chat'

/**
 * 채팅 패널 커스텀 훅
 * 채팅 패널의 모든 로직을 관리합니다.
 */
export function useChatPanel(isOpen: boolean, initialMessage?: string) {
  // 상태 관리: 채팅 메시지들을 배열로 저장
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // 상태 관리: 입력 필드의 현재 값
  const [inputValue, setInputValue] = useState('')
  // 상태 관리: AI 응답을 기다리는 중인지 여부
  const [isLoading, setIsLoading] = useState(false)
  // 상태 관리: 세션 ID
  const [sessionId, setSessionId] = useState<string | null>(null)
  // 상태 관리: 에러 메시지
  const [error, setError] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<string | null>(null)
  // ChatClient 인스턴스 생성
  const chatClient = useRef<ChatClient>(new ChatClient())

  // 패널이 열릴 때 세션 초기화
  useEffect(() => {
    initializeChat()
  }, [])

  // 초기 메시지 처리
  useEffect(() => {
    if (initialMessage && messages.length === 0 && sessionId) {
      handleInitialMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, messages.length, sessionId])

  /**
   * 채팅 초기화 함수
   */
  const initializeChat = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 기존 세션 확인
      const existingSessionId = chatClient.current.getSessionId()

      if (existingSessionId) {
        // 기존 세션의 히스토리 불러오기
        const history = await chatClient.current.getHistory()
        setMessages(history)
        setSessionId(existingSessionId)
      } else {
        // 새 세션 생성
        const newSessionId = await chatClient.current.createSession()
        setSessionId(newSessionId)
      }
    } catch (error) {
      setError('채팅을 초기화하는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 초기 메시지 처리 함수
   */
  const handleInitialMessage = async () => {
    if (!initialMessage) return

    try {
      setIsLoading(true)

      // 초기 사용자 메시지 추가
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: initialMessage,
        type: 'text',
        timestamp: new Date(),
      }
      setMessages([userMessage])

      // AI 응답을 위한 빈 메시지 생성
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        type: 'text',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 스트리밍 방식으로 AI 응답 받기
      await chatClient.current.sendMessageStream(initialMessage, (data) => {
        // 완전히 동적으로 데이터 처리

        if (typeof data === 'object' && data !== null) {
          const typedData = data as any // 완전히 동적 처리
          // 완료 상태 체크 (다양한 완료 표현을 허용)
          const isCompleted = typedData.type === 'run_finished' || typedData.type === 'final_answer'

          // 최종 결과 처리
          if (typedData.type === 'final_answer') {
            const resultContent = typedData.final_answer
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: resultContent,
                }
              }
              return updated
            })
          } else if (typedData.step === 'unsupported_question') {
            const unsupportedQuestion = typedData.output.final_answer
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: unsupportedQuestion,
                }
              }
              return updated
            })
          } else {
            // 진행 중 단계 처리 (동적으로 step 정보 추출)
            let step = typedData.data?.step || typedData.step

            // 진행 상황이 있으면 표시
            if (step && !isCompleted) {
              const progressContent = `처리 중... (${step})`

              setMessages((prev) => {
                const updated = [...prev]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    type: 'text',
                    content: progressContent,
                  }
                }
                return updated
              })
            }

            // 일반 콘텐츠 처리
            if (typedData.content) {
              setMessages((prev) => {
                const updated = [...prev]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: typedData.content || '',
                  }
                }
                return updated
              })
            }
          }
        }
      })
    } catch (error) {
      console.error('초기 메시지 처리 실패:', error)
      setError('초기 메시지 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 메시지 전송 함수
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // 사용자 메시지 즉시 화면에 표시
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        type: 'text',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newUserMessage])

      // AI 응답을 위한 빈 메시지 생성
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        type: 'text',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 스트리밍 방식으로 AI 응답 받기
      await chatClient.current.sendMessageStream(userMessage, (data) => {
        if (typeof data === 'object' && data !== null) {
          const typedData = data as any

          // 완료 상태 체크
          const isCompleted = typedData.type === 'run_finished' || typedData.type === 'final_answer'

          // 최종 결과 처리
          if (typedData.type === 'final_answer') {
            const resultContent = typedData.final_answer
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: resultContent,
                }
              }
              return updated
            })
          } else if (typedData.step === 'unsupported_question') {
            const unsupportedQuestion = typedData.output.final_answer
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: unsupportedQuestion,
                }
              }
              return updated
            })
          } else {
            // 진행 중 단계 처리
            let step = typedData.data?.step || typedData.step

            // 진행 상황이 있으면 표시
            if (step && !isCompleted) {
              const progressContent = `처리 중... (${step})`

              setMessages((prev) => {
                const updated = [...prev]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    type: 'text',
                    content: progressContent,
                  }
                }
                return updated
              })
            }

            // 일반 콘텐츠 처리
            if (typedData.content) {
              setMessages((prev) => {
                const updated = [...prev]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: typedData.content || '',
                  }
                }
                return updated
              })
            }
          }
        }
      })

      setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 새 채팅 시작 함수
   */
  const startNewChat = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const newSessionId = await chatClient.current.startNewChat()
      setSessionId(newSessionId)
      setMessages([])
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 에러 해제 함수
   */
  const dismissError = () => {
    setError(null)
  }

  return {
    messages,
    inputValue,
    isLoading,
    sessionId,
    error,
    loadingState,
    setInputValue,
    handleSendMessage,
    startNewChat,
    dismissError,
  }
}
