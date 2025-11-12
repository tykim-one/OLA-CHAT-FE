'use client'

import { useRef, useState } from 'react'

import { SearchStockForm } from '@/components/search-stock-form'

import { ChatContentsFoldProvider } from '@/hooks/chat/useChatContentsFold'

import { ModernChatContainerProps } from '@/types/modern-chat'

import ModernChatInput from './ModernChatInput'
import ModernChatMessageList from './ModernChatMessageList'
import RecommendedContent from './RecommendedContent'
import WelcomeSection from './WelcomeSection'

/**
 * 모던 채팅 컨테이너 메인 컴포넌트
 * Figma 디자인의 전체 채팅 인터페이스를 구현
 * 상태에 따라 다른 UI를 표시
 */
export default function ModernChatContainer({
  chatState,
  messages,
  isChatLoading,
  recommendedQuestions = [],
  stocks = [], // stocks prop 추가
  tabOptions = [],
  welcomeConfig,
  recommendedConfig,
  onSendMessage,
  onQuestionClick,
  onTabChange,
  showWelcomeMessage = true,
  showRecommendedContent = true,
  className = '',
  inputValue = '',
  onInputChange = () => {},
  activeTab = 'recommended',
  onAbort,
}: ModernChatContainerProps & {
  inputValue?: string
  onInputChange?: (value: string) => void
  stocks?: any[] // stocks prop 타입 추가
  onAbort?: () => void
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  // 채팅 영역 렌더링 함수
  const renderChatArea = () => {
    // 메시지가 있는 상태: 메시지 리스트 표시

    if (messages.length > 0) {
      return (
        <div
          className="overflow-y-auto overflow-x-hidden h-full scrollbar-hide"
          ref={scrollContainerRef}
        >
          <div className="px-4">
            {showWelcomeMessage && welcomeConfig && (
              <div className="w-full pt-4 flex-shrink-0">
                <WelcomeSection
                  title={welcomeConfig.title}
                  subtitle={welcomeConfig.subtitle}
                  showIcon={welcomeConfig.showIcon}
                />
              </div>
            )}
            {/* 추천 콘텐츠 */}
            {showRecommendedContent && recommendedConfig && (
              <RecommendedContent
                title={recommendedConfig.title}
                icon={recommendedConfig.icon}
                tabs={recommendedConfig.tabs}
                questions={recommendedQuestions}
                stocks={stocks}
                activeTab={activeTab || 'recommended'}
                onTabChange={onTabChange}
                onQuestionClick={onQuestionClick}
              />
            )}
          </div>
          <ChatContentsFoldProvider>
            <ModernChatMessageList
              messages={messages}
              isLoading={chatState === 'ai_loading' || chatState === 'message_sending'}
              className="px-4 pt-0"
              onQuestionClick={onQuestionClick}
              scrollContainerRef={scrollContainerRef}
            />
          </ChatContentsFoldProvider>
        </div>
      )
    }

    // IDLE 상태: 환영 메시지 + 추천 콘텐츠
    if (chatState === 'idle' || chatState === 'user_typing') {
      return (
        <div className="overflow-y-auto overflow-x-hidden h-full scrollbar-hide">
          {/* 환영 섹션 - 전체 너비 */}
          {showWelcomeMessage && welcomeConfig && (
            <div className="w-full pt-4 px-4 flex-shrink-0">
              <WelcomeSection
                title={welcomeConfig.title}
                subtitle={welcomeConfig.subtitle}
                showIcon={welcomeConfig.showIcon}
              />
            </div>
          )}

          {/* 추천 콘텐츠 */}
          <div className="flex flex-col gap-4 px-4 pb-4">
            {showRecommendedContent && recommendedConfig && (
              <RecommendedContent
                title={recommendedConfig.title}
                icon={recommendedConfig.icon}
                tabs={recommendedConfig.tabs}
                questions={recommendedQuestions}
                stocks={stocks}
                activeTab={activeTab || 'recommended'}
                onTabChange={onTabChange}
                onQuestionClick={onQuestionClick}
              />
            )}
          </div>
        </div>
      )
    }

    // 기타 상태: 빈 화면

    return <div className="flex-1" />
  }

  // 입력 필드 상태 결정
  const getInputState = () => {
    if (chatState === 'user_typing') return 'focused'
    if (chatState === 'ai_loading' || chatState === 'message_sending') return 'loading'
    return 'default'
  }

  return (
    <div
      className={`w-[700px] h-[100dvh] max-h-[820px] rounded-[8px] border-none border-[#CBD5E1] bg-white flex flex-col md:h-screen md:max-h-[820px] md:rounded-[8px] ${className}`}
    >
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-hidden">{renderChatArea()}</div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-slate-200 flex gap-3 relative">
        <SearchStockForm
          className="flex-1 relative self-end"
          onActiveChange={setIsSearchActive}
          disabled={isChatLoading}
          onSelect={(stock) => {
            const prompt = `${stock.name}(${stock.ticker}) 종합적으로 분석해줘`

            onInputChange(`${inputValue} ${prompt}`)
          }}
        />
        {!isSearchActive && (
          <ModernChatInput
            value={inputValue}
            onChange={onInputChange}
            onSend={onSendMessage}
            onAbort={onAbort}
            state={getInputState()}
            placeholder="IBK투자증권 챗봇에게 무엇이든 물어보세요!"
            disabled={chatState === 'message_sending' || chatState === 'ai_loading'}
            showSendButton={true}
          />
        )}
      </div>
    </div>
  )
}
