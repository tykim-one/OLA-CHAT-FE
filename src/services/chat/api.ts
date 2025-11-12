import { ChatClient } from '@/lib/chatClient'

import { ChatMessage } from '@/types/chat'

import {
  ChatService,
  ChatServiceConfig,
  CreateSessionRequest,
  SendMessageRequest,
  StreamCallback,
  StreamController,
} from './types'

/**
 * 채팅 API 서비스 구현
 * ChatClient를 래핑하여 서비스 레이어 인터페이스 제공
 */
export class ChatApiService implements ChatService {
  private client: ChatClient
  private config: ChatServiceConfig

  constructor(config: ChatServiceConfig) {
    this.config = config
    this.client = new ChatClient(config.baseUrl)
  }

  setConfig(options: { auth?: string | number | null, encData?: string | null, mts?: string | number | null }) {
    this.client.setConfig(options)
  }

  async createSession(request?: CreateSessionRequest): Promise<string> {
    try {
      return await this.client.createSession()
    } catch (error) {
      console.error('세션 생성 실패:', error)
      throw new Error('세션을 생성할 수 없습니다.')
    }
  }

  async logUserInfo(): Promise<boolean> {
    try {
      return await this.client.logUserInfo()
    } catch (error) {
      console.error('인증 실패:', error)
      throw new Error('인증을 할 수 없습니다.')
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<string> {
    try {
      return await this.client.sendMessage(request.message, request.model)
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      throw new Error('메시지를 전송할 수 없습니다.')
    }
  }

  async sendMessageStream(message: string, onData: StreamCallback, model?: string): Promise<StreamController> {
    try {
      return await this.client.sendMessageStream(message, onData, model)
    } catch (error) {
      console.error('스트리밍 메시지 전송 실패:', error)
      throw new Error('메시지 스트리밍을 시작할 수 없습니다.')
    }
  }

  async getHistory(request: any): Promise<ChatMessage[]> {
    try {
      return await this.client.getHistory(request.limit)
    } catch (error) {
      console.error('채팅 히스토리 조회 실패:', error)
      throw new Error('채팅 히스토리를 불러올 수 없습니다.')
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      return await this.client.deleteSession()
    } catch (error) {
      console.error('세션 삭제 실패:', error)
      throw new Error('세션을 삭제할 수 없습니다.')
    }
  }

  async startNewChat(): Promise<string> {
    try {
      return await this.client.startNewChat()
    } catch (error) {
      console.error('새 채팅 시작 실패:', error)
      throw new Error('새 채팅을 시작할 수 없습니다.')
    }
  }

  getSessionId(): string | null {
    return this.client.getSessionId()
  }

  abortCurrentStream(): void {
    this.client.abortCurrentStream()
  }
}

// 기본 설정으로 서비스 인스턴스 생성
export const chatService = new ChatApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 30000,
})
