// Modern Chat System Types - Figma 디자인 기반
import { CreateSessionRequest, SendMessageRequest, StreamCallback } from '@/services'
import { ChatMessage } from '@/types/chat'

export type ModernChatMessage = ChatMessage

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
  isChatLoading?: boolean

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
  id: ChatMessage['id']
  type: ChatMessage['type']
  // content: string
  role: ChatMessage['role']
  content: ChatMessage['content']
  timestamp?: Date
  showAvatar?: boolean
  isLoading?: boolean
  className?: string
  onQuestionClick: (question: string) => void
  isContentsCardOpen?: boolean
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
  onAbort?: () => void
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
  activeTab: string
}

export interface RecommendedQuestionProps {
  title: string
  questions: string[]
  onQuestionClick: (question: string) => void
  className?: string
}

// Hook Types
export interface UseChatContainerProps {
  initialState?: ModernChatState
  welcomeConfig?: WelcomeConfig
  recommendedConfig?: RecommendedConfig
  apiEndpoint?: string
  // 실제 API 연동을 위한 추가 속성들
  initialMessage?: string
  initialPrompt?: string
  onDisclosureViewClick?: () => void
  onDisclosureDataUpdate?: (data: string[]) => void
}

export interface ChatContainerState {
  current: ModernChatState
  messages: ModernChatMessage[]
  inputValue: string
  activeTab: string
  isLoading: boolean
  error: string | null
}

export interface UseChatContainerReturn {
  // 상태
  chatState: ModernChatState
  messages: ModernChatMessage[]
  inputValue: string
  activeTab: string
  isLoading: boolean
  error: string | null
  sessionId: string | null
  loadingState: string | null

  // 데이터
  filteredQuestions: RecommendedQuestion[]
  filteredStocks: any[]

  // 액션
  sendMessage: (message: string) => Promise<void>
  handleQuestionClick: (question: string) => void
  handleTabChange: (tab: string) => void
  setInputValue: (value: string) => void
  clearError: () => void
  resetChat: () => Promise<void>
}

export interface ChartData {
  open: number
  high: number
  low: number
  close: number
  change: number
  changePercent: number
  volume: string
  movingAverages: {
    ma5: string
    ma10: string
    ma20: string
    ma60: string
    ma120: string
  }
}

export interface ChartInfoCardProps {
  title: string
  chartData: any
  className?: string
}

export interface EtfContentProps {
  title: string
  discription: string
  tableData: any
  className?: string
}

export interface StreamController {
  abort: () => void
}

export interface ChatService {
  createSession(request?: CreateSessionRequest): Promise<string>
  sendMessage(request: SendMessageRequest): Promise<string>
  sendMessageStream(message: string, onData: StreamCallback, model?: string): Promise<StreamController>
  abortCurrentStream(): void // 새로운 메서드 추가
  deleteSession(sessionId: string): Promise<boolean>
  startNewChat(): Promise<string>
  getSessionId(): string | null
}
