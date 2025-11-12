'use client'

import { memo, useMemo } from 'react'

import { ChartBlock, ChartGroupBlock } from '@/components/chart/ChartBlock'
import EtfContent from '@/components/chat/modern/EtfContent'

import { ChartPresetKey, createRenderChartModel } from '@/types/editor/chart'
import { ModernChatBubbleProps } from '@/types/modern-chat'

import {
  ChatChartGroupMessage,
  ChatChartMessage,
  ChatRecommendationQuestionMessage,
  ChatTableMessage,
  ChatTextMessage,
} from '@/types'

import AssistantBubble from './AssistantBubble'
import LoadingBubble from './LoadingBubble'
import UserBubble from './UserBubble'

import RecommendedQuestion from '../RecommendedQuestion'
import { AIResponseStart } from '../AIResponseStart'

/**
 * 모던 채팅 버블 메인 컴포넌트
 * 타입에 따라 적절한 버블 컴포넌트를 렌더링
 */
const ModernChatBubble = memo(function ModernChatBubble({
  id,
  type,
  role,
  content,
  timestamp,
  showAvatar = false,
  isLoading = false,
  className = '',
  onQuestionClick,
  isContentsCardOpen,
}: ModernChatBubbleProps) {
  // 메시지 객체를 useMemo로 메모이제이션
  const message = useMemo(
    () => ({
      id,
      content,
      role: role,
      timestamp: timestamp || new Date(),
      isStreaming: isLoading,
      type: type,
    }),
    [id, content, role, timestamp, isLoading, type],
  )

  // 로딩 상태일 때
  if (isLoading) {
    return (
      <LoadingBubble
        message={'최신 데이터를 불러오고 있습니다.'}
        showDots={true}
        className={className}
      />
    )
  }

  // 사용자 메시지일 때
  if (role === 'user' && type === 'text') {
    return <UserBubble message={message as ChatTextMessage} className={className} />
  }

  // AI 어시스턴트 메시지일 때
  if (role === 'assistant') {
    if (message.type === 'llm_answer_start') {
      return <AIResponseStart />
    }

    if (message.type === 'text' || message.type === 'llm_answer') {
      return (
        <AssistantBubble
          message={message as ChatTextMessage}
          className={className}
          onQuestionClick={onQuestionClick}
        />
      )
    } else if (message.type === 'chart') {
      const { content } = message as ChatChartMessage

      // 차트 모델을 useMemo로 메모이제이션
      const chartModel = useMemo(
        () =>
          createRenderChartModel({
            chartPresetKey: content.preset as ChartPresetKey,
            ticker: content.ticker,
            name: content.name,
            market: content.market,
            chartContent: content.chartContent,
          }),
        [content.preset, content.ticker, content.market],
      )

      return <ChartBlock id={id} payload={chartModel} isOpen={isContentsCardOpen} />
    } else if (message.type === 'chart_group') {
      const { content } = message as ChatChartGroupMessage

      const chartModels = useMemo(
        () =>
          content
            .map((d) =>
              createRenderChartModel({
                chartPresetKey: d.preset as ChartPresetKey,
                ticker: d.ticker,
                name: d.name,
                market: d.market,
                chartContent: d.chartContent,
              }),
            )
            .filter((d) => d !== null),
        [content],
      )

      return <ChartGroupBlock id={id} payload={chartModels} isOpen={isContentsCardOpen} />
    } else if (message.type === 'table') {
      const { content } = message as ChatTableMessage

      // 테이블 데이터를 useMemo로 메모이제이션
      const tableData = useMemo(
        () => ({
          header: content.headers,
          rows: content.rows,
        }),
        [content.headers, content.rows],
      )

      return (
        <EtfContent
          title={content.title!}
          discription={content.description!}
          tableData={tableData}
        />
      )
    } else if (message.type === 'recommendation_question') {
      const { content } = message as ChatRecommendationQuestionMessage

      return (
        <RecommendedQuestion
          title={'추천 질문'}
          questions={content.questions!}
          onQuestionClick={onQuestionClick}
        />
      )
    }
  }

  return null
})

export default ModernChatBubble
