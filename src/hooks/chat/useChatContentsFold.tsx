import { ReactNode, createContext, useCallback, useContext, useState } from 'react'

/**
 * ChatContentsFold Context의 타입 정의
 */
interface ChatContentsFoldContextType {
  // 상태
  openCardId: string

  // 액션 함수들
  toggleCard: (cardId: string) => void
  openCard: (cardId: string) => void
  closeCard: (cardId: string) => void
  closeAllCards: () => void
  handleContentsCardFold: (cardId: string) => void

  // 유틸리티 함수들
  isCardOpen: (cardId: string) => boolean
}

/**
 * ChatContentsFold Context 생성
 */
const ChatContentsFoldContext = createContext<ChatContentsFoldContextType | undefined>(undefined)

/**
 * ChatContentsFold Provider Props 타입
 */
interface ChatContentsFoldProviderProps {
  children: ReactNode
}

/**
 * 채팅 영역의 ChartInfoCard fold 상태를 관리하는 Context Provider
 * 여러 개의 ChartInfoCard 중 하나만 열려있도록 제어
 */
export function ChatContentsFoldProvider({ children }: ChatContentsFoldProviderProps) {
  // 현재 열려있는 ChartInfoCard의 ID를 저장
  const [openCardId, setOpenCardId] = useState<string>('')

  /**
   * ChartInfoCard의 fold 상태를 변경하는 함수
   * @param cardId - 변경할 카드의 ID
   */
  const toggleCard = useCallback((cardId: string) => {
    setOpenCardId((prevId) => {
      // 같은 카드를 클릭한 경우 닫기
      if (prevId === cardId) {
        return ''
      }
      // 다른 카드를 클릭한 경우 해당 카드만 열기
      return cardId
    })
  }, [])

  /**
   * 특정 카드를 강제로 열기
   * @param cardId - 열고자 하는 카드의 ID
   */
  const openCard = useCallback((cardId: string) => {
    setOpenCardId(cardId)
  }, [])

  /**
   * 특정 카드를 강제로 닫기
   * @param cardId - 닫고자 하는 카드의 ID
   */
  const closeCard = useCallback((cardId: string) => {
    setOpenCardId((prevId) => (prevId === cardId ? '' : prevId))
  }, [])

  /**
   * 모든 카드를 닫기
   */
  const closeAllCards = useCallback(() => {
    setOpenCardId('')
  }, [])

  /**
   * 특정 카드가 열려있는지 확인
   * @param cardId - 확인할 카드의 ID
   * @returns 해당 카드가 열려있으면 true, 아니면 false
   */
  const isCardOpen = useCallback(
    (cardId: string) => {
      return openCardId === cardId
    },
    [openCardId],
  )

  /**
   * ChartInfoCard의 onChange 핸들러로 사용할 함수
   * @param cardId - 변경된 카드의 ID
   */
  const handleContentsCardFold = useCallback(
    (cardId: string) => {
      toggleCard(cardId)
    },
    [toggleCard],
  )

  const contextValue: ChatContentsFoldContextType = {
    // 상태
    openCardId,

    // 액션 함수들
    toggleCard,
    openCard,
    closeCard,
    closeAllCards,
    handleContentsCardFold,

    // 유틸리티 함수들
    isCardOpen,
  }

  return (
    <ChatContentsFoldContext.Provider value={contextValue}>
      {children}
    </ChatContentsFoldContext.Provider>
  )
}

/**
 * ChatContentsFold Context를 사용하는 훅
 * @returns ChatContentsFoldContext의 값
 * @throws Error - Provider 외부에서 사용할 경우
 */
export function useChatContentsFold(): ChatContentsFoldContextType {
  const context = useContext(ChatContentsFoldContext)

  if (context === undefined) {
    throw new Error('useChatContentsFold must be used within a ChatContentsFoldProvider')
  }

  return context
}

export type UseChatContentsFoldReturn = ChatContentsFoldContextType
