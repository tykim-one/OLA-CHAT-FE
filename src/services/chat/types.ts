import { ChatMessage } from '@/types/chat'

export interface ChatServiceConfig {
  baseUrl: string
  timeout?: number
}

export interface CreateSessionRequest {
  userId?: string
}

export interface SendMessageRequest {
  sessionId: string
  message: string
  model?: string
}

export interface ChatServiceResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface StreamCallback {
  (data: any): void
}

export interface StreamController {
  abort: () => void
}

export interface ChatService {
  createSession(request?: CreateSessionRequest): Promise<string>
  logUserInfo(): Promise<boolean>
  sendMessage(request: SendMessageRequest): Promise<string>
  sendMessageStream(message: string, onData: StreamCallback, model?: string): Promise<StreamController>
  abortCurrentStream(): void
  deleteSession(sessionId: string): Promise<boolean>
  startNewChat(): Promise<string>
  getSessionId(): string | null
}
