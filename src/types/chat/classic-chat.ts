/**
 * 기존 채팅 시스템 타입 정의
 */

/**
 * 채팅 메시지 타입 정의
 * role: 메시지를 보낸 주체 (사용자 또는 AI 어시스턴트)
 * content: 메시지 내용
 * timestamp: 메시지가 생성된 시간
 */

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatState {
  currentSession: ChatSession | null
  sessions: ChatSession[]
  isLoading: boolean
  error: string | null
}

// 백엔드 스트리밍 데이터 타입 (완전히 동적)
export interface StreamStepData {
  [key: string]: any // 어떤 속성이든 허용
}

// 기존 스트리밍 응답 타입 정의 (하위 호환성)
export interface StreamStatusData {
  type: 'status'
  step: 'processing' | 'searching' | 'generating' | 'finalizing'
  message: string
  progress?: number // 0-100 진행률 (선택사항)
}

export interface StreamContentData {
  type: 'content'
  content: string
  delta?: string // 증분 내용 (선택사항)
}

export interface StreamErrorData {
  type: 'error'
  message: string
  code?: string
}

export interface StreamDoneData {
  type: 'done'
  final_content?: string
}

export type StreamData =
  | StreamStepData
  | StreamStatusData
  | StreamContentData
  | StreamErrorData
  | StreamDoneData

// 채팅 상태 관리를 위한 타입
export interface ChatStreamState {
  currentStatus: string
  currentStep: string
  progress: number
  isStreaming: boolean
  error: string | null

  // 단계별 상태 추가
  stepData?: {
    step_1_parse?: StreamStepData
    step_2_query?: StreamStepData
    step_3_format?: StreamStepData
    done?: StreamStepData
  }
}

/**
 * ChatPanel 컴포넌트의 Props 타입 정의
 */
export interface ChatPanelProps {
  isOpen: boolean // 채팅 패널의 열림/닫힘 상태
  onClose: () => void // 패널을 닫는 함수
  initialMessage?: string // 초기 메시지 (선택사항)
}

/**
 * 채팅 헤더 Props 타입
 */
export interface ChatHeaderProps {
  sessionId: string | null
  onClose: () => void
}

/**
 * 채팅 메시지 Props 타입
 */
export interface ChatMessageProps {
  message: ChatMessage
}

/**
 * 채팅 메시지 목록 Props 타입
 */
export interface ChatMessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string | null
}

/**
 * 채팅 입력 Props 타입
 */
export interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  onSendMessage: () => void
  isLoading: boolean
  sessionId: string | null
}

/**
 * 채팅 에러 메시지 Props 타입
 */
export interface ChatErrorMessageProps {
  error: string
  onDismiss: () => void
}
