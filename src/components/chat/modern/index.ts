// Modern Chat Components
export { default as ModernChatContainer } from './ModernChatContainer'
export { default as WelcomeSection } from './WelcomeSection'
export { default as RecommendedContent } from './RecommendedContent'
export { default as ModernChatInput } from './ModernChatInput'
export { default as ModernChatMessageList } from './ModernChatMessageList'
export { default as LoadingDots } from './LoadingDots'
export { default as TabMenu } from './TabMenu'
export { default as QuestionList } from './QuestionList'
export { AIResponseStart } from './AIResponseStart'

// Bubble Components
export { default as ModernChatBubble } from './bubbles/ModernChatBubble'
export { default as UserBubble } from './bubbles/UserBubble'
export { default as AssistantBubble } from './bubbles/AssistantBubble'
export { default as LoadingBubble } from './bubbles/LoadingBubble'

// Hooks - 실제 API 연동이 되는 버전 사용
export { useChatContainer } from '@/hooks/modern-chat/useChatContainer'

// Types
export * from '@/types/modern-chat'
