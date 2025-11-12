import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { createChatMessageId } from '@/lib/chat'

import { ChatChartGroupMessage, ChatChartMessage, ChatMessage } from '@/types/chat'

import { chatService } from '@/services/chat'
import { mockMessages } from './mockMessages'
import { useInitFromQueryParams } from '@/providers'

// Mock 모드 설정 (API 서버가 없을 때 테스트용)
const USE_MOCK_MODE = false

export type ChunkTransferState =
  | 'chunk_transfer_start'
  | 'chunk_transfer_sending'
  | 'chunk_transfer_end'
  | null

/**
 * 채팅 비즈니스 로직을 관리하는 ViewModel 훅
 * 실제 API와의 통신을 담당하며, UI 상태와 분리된 비즈니스 로직을 제공
 */
export interface ChatViewModel {
  // 상태
  messages: ChatMessage[]
  sessionId: string | null
  isLoading: boolean
  error: string | null
  loadingState: string | null
  chunkTransferState: ChunkTransferState // 청크 전송 상태 추가

  // 액션
  initializeChat: () => Promise<void>
  sendMessage: (message: string) => Promise<void>
  startNewChat: () => Promise<void>
  clearError: () => void
  abortCurrentStream: () => void // 새로운 메서드 추가
}

export function useChatViewModel({ initialMessage }: { initialMessage?: string }): ChatViewModel {
  const { queryParams, isInitialized } = useInitFromQueryParams()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<string | null>(null)
  const [chunkTransferState, setChunkTransferState] = useState<ChunkTransferState>(null) // 청크 전송 상태 추가

  const chunkMessageIdRef = useRef<string | null>(null)
  const currentStreamControllerRef = useRef<{ abort: () => void } | null>(null) // 현재 스트림 컨트롤러 참조 추가

  // Mock 세션 ID 생성
  const generateMockSessionId = (): string => {
    return `mock-session-${Date.now()}`
  }

  // 채팅 초기화
  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const newSessionId = await chatService.createSession()
      setSessionId(newSessionId)
    } catch (error) {
      setError('채팅을 초기화하는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      chatService.setConfig({ 
        auth: queryParams?.auth, 
        encData: queryParams?.encData, 
        mts: queryParams?.mts 
      })
      chatService.logUserInfo()  
    }
  }, [queryParams, isInitialized])

  // 초기 메시지 처리
  useEffect(() => {
    if (initialMessage && messages.length === 0 && sessionId) {
      handleInitialMessage()
    }
  }, [initialMessage, messages.length, sessionId])

  const handleInitialMessage = async () => {
    if (!initialMessage) return

    try {
      setIsLoading(true)

      // 초기 사용자 메시지 추가
      const userMessage: ChatMessage = {
        id: createChatMessageId(),
        type: 'text',
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      }
      setMessages([userMessage])

      // AI 응답을 위한 빈 메시지 생성
      const aiMessage: ChatMessage = {
        id: createChatMessageId(),
        type: 'text',
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 스트리밍 방식으로 AI 응답 받기
      await chatService.sendMessageStream(initialMessage, (data) => {
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
          } else if (typedData.content || typedData.delta || typedData.text) {
            // 기존 형식 지원 (호환성 유지)
            const newContent = typedData.content || typedData.delta || typedData.text
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              if (updated[lastIndex]?.role === 'assistant') {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: updated[lastIndex].content + newContent,
                }
              }
              return updated
            })
          }
        }
      })
    } catch (error) {
      setError('초기 메시지 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 메시지 전송
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        return
      }

      if (isLoading) {
        return
      }

      if (!sessionId) {
        return
      }

      const userMessage = message.trim()
      setIsLoading(true)
      setError(null)
      setChunkTransferState(null)

      try {
        // 사용자 메시지 즉시 화면에 표시
        const newUserMessage: ChatMessage = {
          id: createChatMessageId(),
          type: 'text',
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        }
        setMessages((prev) => {
          const updated = [...prev, newUserMessage]
          return updated
        })

        // AI 응답을 위한 빈 메시지 생성
        const aiMessage: ChatMessage = {
          id: '0',
          type: 'text',
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        }
        setMessages((prev) => {
          const updated = [...prev, aiMessage]
          return updated
        })

        // 스트림 컨트롤러를 즉시 저장
        const streamController = await chatService.sendMessageStream(userMessage, (data) => {
          if (typeof data === 'object' && data !== null) {
            const typedData = data as any

            // step_progress 타입 처리 추가
            if (typedData.type === 'step_progress') {
              const stepData = typedData
              const step = typedData.step
              if (step === 'FINAL_MERGE') {
                setMessages((prev) => {
                  return [
                    ...prev,
                    {
                      id: createChatMessageId(),
                      type: 'llm_answer_start',
                      role: 'assistant',
                      content: null,
                      timestamp: new Date(),
                    }
                  ]
                })

                const {
                  step_results: {
                    stock_price_node: { dataset: stockPriceDataSets = [] } = {},
                    etf_price_node: { dataset: etfPriceDataSets = [] } = {},
                    stock_finance_node: { dataset: stockFinanceDataSets = [] } = {},
                    stock_etf_node: { dataset: stockEtfDataSets = [] } = {},
                    etf_sector_node: { dataset: etfSectorDataSets = [] } = {},
                    etf_composed_stock_node: { dataset: etfComposedStockDataSets = [] } = {},
                  } = {},
                } = stepData || {}

                const hasStockPriceData = stockPriceDataSets.length > 0
                const hasEtfPriceData = etfPriceDataSets.length > 0
                const hasStockFinanceData = stockFinanceDataSets.length > 0
                const hasStockEtfData = stockEtfDataSets.length > 0
                const hasEtfSectorData = etfSectorDataSets.length > 0
                const hasEtfComposedStockData = etfComposedStockDataSets.length > 0

                if (hasStockPriceData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...['PRICE_INFORMATION'].map(
                        (preset): ChatChartGroupMessage => ({
                          id: createChatMessageId(),
                          type: 'chart_group',
                          content: stockPriceDataSets.map((d: any) => ({
                            preset,
                            ticker: d.ticker,
                            name: d.name,
                            market: d.country,
                          })),
                          role: 'assistant',
                          timestamp: new Date(),
                        }),
                      ),
                    ]
                  })
                }

                if (hasEtfPriceData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...['PRICE_INFORMATION'].map(
                        (preset): ChatChartGroupMessage => ({
                          id: createChatMessageId(),
                          type: 'chart_group',
                          content: etfPriceDataSets.map((d: any) => ({
                            preset,
                            ticker: d.ticker,
                            name: d.name,
                            market: d.country,
                          })),
                          role: 'assistant',
                          timestamp: new Date(),
                        }),
                      ),
                    ]
                  })
                }

                if (hasStockFinanceData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...['INCOME_STATEMENT_TRENDS', 'VALUATION_MULTIPLES_CHART'].map(
                        (preset): ChatChartGroupMessage => ({
                          id: createChatMessageId(),
                          type: 'chart_group',
                          content: stockFinanceDataSets.map((d: any) => ({
                            preset,
                            ticker: d.ticker,
                            name: d.name,
                            market: d.country,
                          })),
                          role: 'assistant',
                          timestamp: new Date(),
                        }),
                      ),
                    ]
                  })
                }

                if (hasStockEtfData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...stockEtfDataSets.map((table: any) => ({
                        id: createChatMessageId(),
                        type: 'table',
                        content: {
                          title: table.data.title,
                          description: table.data.description,
                          headers: table.data.data.headers,
                          rows: table.data.data.rows,
                        },
                        role: 'assistant',
                        timestamp: new Date(),
                      })),
                    ]
                  })
                }

                if (hasEtfSectorData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...['ETF_WEIGHTS'].map(
                        (preset): ChatChartGroupMessage => ({
                          id: createChatMessageId(),
                          type: 'chart_group',
                          content: etfSectorDataSets.map((dataSet: any) => ({
                            preset,
                            ticker: dataSet.ticker,
                            name: dataSet.name,
                            market: dataSet.country,
                            chartContent: {
                              meta: {
                                s: '',
                              },
                              columns: [{ field: 'ticker' }, { field: 'weight' }],
                              rows: dataSet.data.data.rows.map(([ticker, weight]: any) => {
                                return {
                                  ticker: ticker,
                                  weight: Number(weight),
                                }
                              }),
                            },
                          })),
                          role: 'assistant',
                          timestamp: new Date(),
                        }),
                      ),
                    ]
                  })
                }

                if (hasEtfComposedStockData) {
                  setMessages((prev) => {
                    return [
                      ...prev,
                      ...etfComposedStockDataSets.map((table: any) => ({
                        id: createChatMessageId(),
                        type: 'table',
                        content: {
                          title: table.data.title,
                          description: table.data.description,
                          headers: table.data.data.headers,
                          rows: table.data.data.rows,
                        },
                        role: 'assistant',
                        timestamp: new Date(),
                      })),
                    ]
                  })
                }
              } else if (step === 'ibk_securities_recommendation_question_node') {
                const questions = stepData.step_results.recommendation_question_node
                const questionsMessages: ChatMessage[] =
                  questions.length > 0
                    ? [
                        {
                          id: createChatMessageId(),
                          type: 'recommendation_question',
                          content: {
                            questions: questions,
                          },
                          role: 'assistant',
                          timestamp: new Date(),
                        },
                      ]
                    : []

                setMessages((prev) => {
                  return [...prev, ...questionsMessages]
                })
              }
            } else if (typedData.type === 'chunk_start') {
              setChunkTransferState('chunk_transfer_start')

              if (typedData.node === 'final_stock_ambiguous_answer_node') {
                setMessages((prev) => {
                  return [
                    ...prev,
                    {
                      id: createChatMessageId(),
                      type: 'llm_answer_start',
                      role: 'assistant',
                      content: null,
                      timestamp: new Date(),
                    }
                  ]
                })
              }

              // 청크 메시지를 위한 새로운 ChatMessage 생성
              const chunkMessageId = `chunk-${Date.now()}-${Math.random()}`
              chunkMessageIdRef.current = chunkMessageId

              const chunkMessage: ChatMessage = {
                id: chunkMessageId,
                type: 'llm_answer',
                role: 'assistant',
                content: '',
                timestamp: new Date(),
              }

              // 기존 AI 메시지 제거하고 청크 메시지 추가
              setMessages((prev) => {
                const filteredMessages = prev.filter((msg) => msg.id !== '0')
                return [...filteredMessages, chunkMessage]
              })
            } else if (typedData.type === 'chunk_inprogress') {
              setChunkTransferState('chunk_transfer_sending')

              setMessages((prev) => {
                return prev.map((msg) => {
                  if (msg.id === chunkMessageIdRef.current) {
                    const newContent = msg.content + typedData.chunk
                    return {
                      ...msg,
                      content: newContent,
                    }
                  }
                  return msg
                })
              })
            } else if (typedData.type === 'chunk_done') {
              setChunkTransferState('chunk_transfer_end')

              // 청크 전송 완료 후 상태 정리
              setTimeout(() => {
                setChunkTransferState(null)
                chunkMessageIdRef.current = null // 청크 메시지 ID 정리
              }, 1000)
            } else if (typedData.type === 'run_finished') {
              setIsLoading(false)
            } else if (typedData.type === 'error') {
              setMessages((prev) => {
                const filteredMessages = prev.filter((d) => d.id !== '0')
                return [
                  ...filteredMessages,
                  {
                    id: createChatMessageId(),
                    type: 'text',
                    content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
                    role: 'assistant',
                    timestamp: new Date(),
                  },
                ]
              })

              setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
              setIsLoading(false)
            }
          }
        })
        
        // 즉시 컨트롤러 저장
        currentStreamControllerRef.current = streamController

        // 스트림 완료를 기다리지 않고 바로 다음 코드 실행
        // (스트림 완료는 콜백에서 처리)

      } catch (error) {
        // 에러 발생 시 AI 응답 메시지를 제거하고 에러 메시지로 대체
        setMessages((prev) => {
          return [
            {
              id: createChatMessageId(),
              type: 'text',
              content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
              role: 'assistant',
              timestamp: new Date(),
            },
          ]
        })

        setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
        setIsLoading(false)
        setChunkTransferState(null)
        chunkMessageIdRef.current = null
        currentStreamControllerRef.current = null
      }
    },
    [isLoading, sessionId],
  )

  // 현재 스트림 중단
  const abortCurrentStream = useCallback(() => {
    if (currentStreamControllerRef.current) {
      try {
        currentStreamControllerRef.current.abort()
        currentStreamControllerRef.current = null
        
        // 상태 초기화
        setIsLoading(false)
        setChunkTransferState(null)
        setLoadingState(null)
        chunkMessageIdRef.current = null
      } catch (error) {
      }
    }
  }, [])

  // 새 채팅 시작
  const startNewChat = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (USE_MOCK_MODE) {
        // Mock 모드: 새로운 Mock 세션 생성
        const newMockSessionId = generateMockSessionId()
        setSessionId(newMockSessionId)
        setMessages([])
      } else {
        // 실제 API 모드
        const newSessionId = await chatService.startNewChat()
        setSessionId(newSessionId)
        setMessages([])
      }
    } catch (error) {
      setError('새 채팅을 시작하는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 에러 해제
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // 상태
    messages,
    sessionId,
    isLoading,
    error,
    loadingState,
    chunkTransferState,

    // 액션
    initializeChat,
    sendMessage,
    startNewChat,
    clearError,
    abortCurrentStream,
  }
}
