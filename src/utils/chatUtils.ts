import { ChatMessage } from '@/types/chat'
import { ModernChatMessage } from '@/types/chat/modern-chat'

/**
 * 채팅 관련 유틸리티 함수들
 */

/**
 * 메시지 ID 생성
 */
export function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * 메시지 타임스탬프 포맷팅
 */
export function formatMessageTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()

  // 1분 이내
  if (diff < 60000) {
    return '방금 전'
  }

  // 1시간 이내
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}분 전`
  }

  // 24시간 이내
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}시간 전`
  }

  // 그 외
  return timestamp.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 메시지 내용에서 링크 추출
 */
export function extractLinks(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return content.match(urlRegex) || []
}

/**
 * 메시지 길이 제한
 */
export function truncateMessage(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) {
    return content
  }
  return content.substring(0, maxLength) + '...'
}

/**
 * 메시지 그룹화 (같은 사용자의 연속 메시지를 그룹화)
 */
export function groupMessages(messages: ChatMessage[]): ChatMessage[][] {
  if (messages.length === 0) return []

  const groups: ChatMessage[][] = []
  let currentGroup: ChatMessage[] = [messages[0]]

  for (let i = 1; i < messages.length; i++) {
    const currentMessage = messages[i]
    const previousMessage = messages[i - 1]

    // 같은 사용자의 연속 메시지인지 확인 (5분 이내)
    const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime()
    const isSameUser = currentMessage.role === previousMessage.role
    const isWithinTimeLimit = timeDiff < 300000 // 5분

    if (isSameUser && isWithinTimeLimit) {
      currentGroup.push(currentMessage)
    } else {
      groups.push(currentGroup)
      currentGroup = [currentMessage]
    }
  }

  groups.push(currentGroup)
  return groups
}
