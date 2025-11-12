/**
 * 사용자 관련 타입 정의
 */
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

/**
 * 채팅 히스토리 항목 타입
 */
export interface ChatHistoryItem {
  id: string
  title: string
  isActive: boolean
  createdAt?: string
  lastAccessedAt?: string
}

/**
 * 사이드바 Props 타입
 */
export interface SidebarProps {
  chatHistory: ChatHistoryItem[]
  onNewChat: () => void
  onSearch?: () => void
  onChatSelect: (chatId: string) => void
  onClearAll?: () => void
  onSettings?: () => void
  onLogout?: () => void
}
