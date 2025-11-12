'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Accordion } from '@/components/ui/accordion'

import { useChatContentsFold } from '@/hooks/chat/useChatContentsFold'

import { cn } from '@/lib/utils'

import { ModernChatMessage } from '@/types/modern-chat'

import LoadingBubble from './bubbles/LoadingBubble'
import ModernChatBubble from './bubbles/ModernChatBubble'

interface ModernChatMessageListProps {
  messages: ModernChatMessage[]
  isLoading: boolean
  className?: string
  onQuestionClick: (question: string) => void
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * 모던 채팅 메시지 목록 컴포넌트
 * 채팅 메시지들을 스크롤 가능한 목록으로 표시
 */
export default function ModernChatMessageList({
  messages,
  isLoading,
  className = '',
  onQuestionClick,
  scrollContainerRef,
}: ModernChatMessageListProps) {
  const { handleContentsCardFold, isCardOpen, openCardId } = useChatContentsFold()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevIsLoadingRef = useRef<boolean>(isLoading)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTopRef = useRef<number>(0)
  const autoScrollEnabledRef = useRef<boolean>(true)

  // 스크롤이 최하단에 있는지 확인
  const isAtBottom = useCallback(() => {
    if (!scrollContainerRef?.current) return true

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const threshold = 10 // 10px 이내면 최하단으로 간주

    return scrollHeight - scrollTop - clientHeight <= threshold
  }, [scrollContainerRef])

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = useCallback(() => {
    if (!messagesEndRef.current || !autoScrollEnabledRef.current) return

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })

    // 스크롤 애니메이션이 완료될 때까지 기다린 후 플래그 해제
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  // 업스크롤링 감지 및 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef?.current
    if (!scrollContainer) return

    const currentScrollTop = scrollContainer.scrollTop

    // 업스크롤링 감지 (위로 스크롤)
    const isScrollingUp = currentScrollTop < lastScrollTopRef.current
    const scrollDifference = Math.abs(currentScrollTop - lastScrollTopRef.current)

    // 최소 스크롤 거리 임계값 (의도적인 스크롤인지 확인)
    const minScrollDistance = 1

    if (isScrollingUp && scrollDifference > minScrollDistance) {
      autoScrollEnabledRef.current = false
    }

    // 다시 최하단에 도달했을 때는 자동 스크롤 재활성화
    if (!autoScrollEnabledRef.current && isAtBottom()) {
      autoScrollEnabledRef.current = true
    }

    lastScrollTopRef.current = currentScrollTop
  }, [scrollContainerRef, isAtBottom])

  // 사용자가 새로운 채팅을 시작할 때 (isLoading false -> true) 강제로 최하단 이동
  useEffect(() => {
    if (!prevIsLoadingRef.current && isLoading) {
      // false에서 true로 바뀌는 시점 = 새로운 채팅 시작
      autoScrollEnabledRef.current = true
      scrollToBottom()
    }
    prevIsLoadingRef.current = isLoading
  }, [isLoading, scrollToBottom])

  // 메시지나 로딩 상태 변경 시 스크롤 처리
  useEffect(() => {
    // 자동 스크롤이 활성화되어 있고 최하단에 있을 때만 자동 스크롤
    if (autoScrollEnabledRef.current) {
      scrollToBottom()
    }
  }, [messages, isLoading, scrollToBottom, isAtBottom])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // 스크롤 컨테이너에 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current
    if (!scrollContainer) return

    // 초기 스크롤 위치 설정
    lastScrollTopRef.current = scrollContainer.scrollTop

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, scrollContainerRef])

  return (
    <div className={`flex flex-col gap-6 flex-1 pb-2 ${className}`}>
      <Accordion
        type="single"
        collapsible
        value={openCardId}
        onValueChange={(value) => {
          handleContentsCardFold(value)
        }}
      >
        {/* 메시지 목록 */}
        {messages.map((message) => {
          const isDummyAnswer = message.id === '0'
          const key = isDummyAnswer ? message.id + Math.random() : message.id

          return (
            <div className={cn(
              'mb-2', 
              isDummyAnswer ? 'mb-0' : '',
              message.type === 'llm_answer' ? 'px-4' : '',
              message.type === 'llm_answer_start' ? 'mb-4' : '',
              message.type === 'recommendation_question' ? 'mb-0' : '',
              message.role === 'user' ? 'my-8' : ''
            )} key={key}>
              <ModernChatBubble
                id={message.id}
                role={message.role}
                type={message.type} // role을 직접 type으로 사용 ('user' | 'assistant')
                content={message.content}
                timestamp={message.timestamp}
                isLoading={message.type === 'text' && message.isStreaming}
                className="w-full"
                onQuestionClick={onQuestionClick}
                isContentsCardOpen={isCardOpen(message.id)}
              />
            </div>
          )
        })}
      </Accordion>

      {/* 로딩 중일 때 로딩 버블 표시 */}
      {isLoading && (
        <LoadingBubble
          message="최신 데이터를 불러오고 있습니다."
          showDots={true}
          className="w-full"
        />
      )}

      {/* 스크롤 앵커 */}
      <div ref={messagesEndRef} />
    </div>
  )
}
