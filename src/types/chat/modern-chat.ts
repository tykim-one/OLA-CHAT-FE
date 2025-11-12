// Modern Chat System Types - Figma 디자인 기반

export interface ModernChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
  type?: 'query' | 'answer' | 'loading'
}

export type ModernChatState =
  | 'idle'
  | 'user_typing'
  | 'message_sending'
  | 'ai_loading'
  | 'response_rendered'

export interface TabOption {
  id: string
  label: string
  emoji?: string
  isSelected?: boolean
}

export interface RecommendedQuestion {
  id: string
  text: string
  category: string
}

export interface WelcomeConfig {
  title: string
  subtitle: string
  showIcon?: boolean
}

export interface RecommendedConfig {
  title: string
  icon?: React.ReactNode
  tabs: TabOption[]
  questions: RecommendedQuestion[]
}

// Component Props Types
export interface ModernChatContainerProps {
  chatState: ModernChatState
  messages: ModernChatMessage[]
  recommendedQuestions?: RecommendedQuestion[]
  tabOptions?: TabOption[]
  welcomeConfig?: WelcomeConfig
  recommendedConfig?: RecommendedConfig

  // Event handlers
  onSendMessage: (message: string) => void
  onQuestionClick: (question: string) => void
  onTabChange: (tab: string) => void

  // UI settings
  showWelcomeMessage?: boolean
  showRecommendedContent?: boolean

  // Styling
  className?: string
  height?: string
  activeTab?: string
}

export interface WelcomeSectionProps {
  title: string
  subtitle: string
  showIcon?: boolean
  className?: string
}

export interface RecommendedContentProps {
  title: string
  icon?: React.ReactNode
  tabs: TabOption[]
  questions: RecommendedQuestion[]
  activeTab: string
  onTabChange: (tab: string) => void
  onQuestionClick: (question: string) => void
  className?: string
}

export interface ModernChatBubbleProps {
  type: 'user' | 'assistant' | 'loading'
  content: string
  timestamp?: Date
  showAvatar?: boolean
  isLoading?: boolean
  className?: string
}

export interface LoadingBubbleProps {
  message: string
  showDots?: boolean
  className?: string
}

export interface ModernChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  state: 'default' | 'focused' | 'loading'
  placeholder?: string
  disabled?: boolean
  showSendButton?: boolean
  className?: string
}

export interface TabMenuProps {
  tabs: TabOption[]
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export interface QuestionListProps {
  questions: RecommendedQuestion[]
  onQuestionClick: (question: string) => void
  className?: string
}

// Hook Types
export interface UseChatContainerProps {
  initialState?: ModernChatState
  welcomeConfig?: WelcomeConfig
  recommendedConfig?: RecommendedConfig
  apiEndpoint?: string
  // 초기 메시지 설정
  initialMessage?: string
}

export interface ChatContainerState {
  current: ModernChatState
  messages: ModernChatMessage[]
  inputValue: string
  activeTab: string
  isLoading: boolean
  error: string | null
}
