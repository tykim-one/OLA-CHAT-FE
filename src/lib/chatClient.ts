import {
  ChatMessage,
  CreateSessionResponse,
  GetHistoryResponse,
  SendMessageResponse,
  SendAuthResponse,
} from '@/types'

/**
 * 채팅 응답에서 공시 데이터를 추출하는 유틸리티 함수
 */
export const extractDisclosureData = (chatData: any) => {
  try {
    // done 단계에서 query_result.data 확인
    if (
      chatData.step === 'dart_rcept_no_parser_node' &&
      chatData.full_state.dart_rcept_no_parser_node.step_results.dart_rcept_no_parser
    ) {
      const data =
        chatData.full_state.dart_rcept_no_parser_node.step_results.dart_rcept_no_parser.rcept_nos

      return data

      // return data.map((item: any) => ({
      //   rcept_no: item.rcept_no,
      //   company_name: item.corp_name,
      //   label: `공시 ${index + 1}번 - ${item.nm || '임원정보'}`,
      // }))
    }
  } catch (error) {
    return []
  }
}

/**
 * 채팅 API와 통신하는 클라이언트 클래스
 * 백엔드의 채팅 API를 활용하여 세션 기반 대화를 관리합니다.
 */
export class ChatClient {
  private baseUrl: string
  private sessionId: string | null = null
  private auth: string | number | null = null
  private encData: string | null = null
  private mts: string | number | null = null
  private currentAbortController: AbortController | null = null // 현재 요청의 AbortController

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl

    // 로컬 스토리지에서 세션 ID 복원 시도
    this.loadSessionFromStorage()
  }

  setConfig(options: { auth?: string | number | null, encData?: string | null, mts?: string | number | null }) {
    this.auth = options.auth || null
    this.encData = options.encData || null
    this.mts = options.mts || null
  }

  /**
   * 로컬 스토리지에서 세션 ID를 불러옵니다
   */
  private loadSessionFromStorage() {
    if (typeof window !== 'undefined') {
      this.sessionId = localStorage.getItem('chat_session_id')
    }
  }

  /**
   * 세션 ID를 로컬 스토리지에 저장합니다
   */
  private saveSessionToStorage(sessionId: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_session_id', sessionId)
    }
  }

  /**
   * 로컬 스토리지에서 세션 ID를 제거합니다
   */
  private removeSessionFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_session_id')
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.auth) {
      headers['x-auth'] = String(this.auth)
    }
  
    if (this.encData) {
      headers['x-enc-data'] = this.encData
    }
  
    if (this.mts) {
      headers['x-mts'] = String(this.mts)
    }
  
    return headers
  }

  /**
   * 새로운 채팅 세션을 생성합니다
   * @returns Promise<string> 생성된 세션 ID
   */
  async createSession(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ibk_securities/chat/session/create`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      const data: CreateSessionResponse = await response.json()

      if (data.success) {
        this.sessionId = data.session_id
        this.saveSessionToStorage(data.session_id)
        return data.session_id
      } else {
        throw new Error(data.message || '세션 생성에 실패했습니다.')
      }
    } catch (error) {
      throw error
    }
  }

  async logUserInfo(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ibk_securities/app/encrypted_data_log`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          data: this.encData,
        }),
      })

      const data: SendAuthResponse = await response.json()
      if (data.success) {
        return true
      } else {
        throw new Error(data.message || '인증에 실패했습니다.')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 메시지를 전송하고 AI 응답을 받습니다
   * @param message 사용자 메시지
   * @param model 사용할 AI 모델 (선택사항)
   * @returns Promise<string> AI 응답
   */
  async sendMessage(message: string, model?: string): Promise<string> {
    // 세션이 없으면 자동으로 생성
    if (!this.sessionId) {
      await this.createSession()
    }

    const requestData = {
      session_id: this.sessionId,
      message: message,
      ...(model && { model: model }),
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/ibk_securities/chat/message`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestData),
      })

      const data: SendMessageResponse = await response.json()

      if (data.success) {
        return data.ai_response
      } else {
        // 세션을 찾을 수 없는 경우 새 세션 생성 후 재시도
        if (data.error?.includes('세션을 찾을 수 없습니다')) {
          await this.createSession()
          return this.sendMessage(message, model)
        }
        throw new Error(data.error || '메시지 전송에 실패했습니다.')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 스트리밍 방식으로 메시지를 전송합니다
   * @param message 사용자 메시지
   * @param onData 스트리밍 데이터를 받을 때 호출되는 콜백 함수
   * @param model 사용할 AI 모델 (선택사항)
   * @returns { abort: () => void } 즉시 중지 함수가 포함된 객체 반환
   */
  async sendMessageStream(
    message: string,
    onData: (data: unknown) => void,
    model?: string,
  ): Promise<{ abort: () => void }> {
    // 세션이 없으면 자동으로 생성
    if (!this.sessionId) {
      await this.createSession()
    }

    // 이전 요청이 있다면 중단
    if (this.currentAbortController) {
      this.currentAbortController.abort()
    }

    // 새로운 AbortController 생성
    this.currentAbortController = new AbortController()
    const abortController = this.currentAbortController

    // abort 함수 정의
    const abortFunction = () => {
      if (abortController && !abortController.signal.aborted) {
        abortController.abort()
        this.currentAbortController = null
      }
    }

    // 컨트롤러 객체를 즉시 반환
    const streamController = { abort: abortFunction }

    // 스트리밍 처리를 별도 함수로 분리하여 비동기적으로 실행
    this.executeStream(message, onData, model, abortController).catch((error) => {
      console.error('스트리밍 실행 중 오류:', error)
    })

    return streamController
  }

  private async executeStream(
    message: string,
    onData: (data: unknown) => void,
    model: string | undefined,
    abortController: AbortController,
  ) {
    // POST 요청으로 보낼 JSON payload
    const requestData = {
      session_id: this.sessionId,
      message: message,
      ...(model && { model: model }),
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/ibk_securities/chat/stream`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestData),
        signal: abortController.signal, // AbortSignal 추가
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 스트리밍 응답 처리
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('응답에서 스트리밍 데이터를 읽을 수 없습니다.')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let chunkCount = 0
      let totalData = '' // 전체 응답 데이터 누적

      try {
        while (true) {
          // AbortSignal 체크
          if (abortController.signal.aborted) {
            throw new Error('Request was aborted')
          }

          const { done, value } = await reader.read()
          chunkCount++

          if (done) {
            break
          }

          // 받은 데이터를 텍스트로 변환
          const chunk = decoder.decode(value, { stream: true })

          const cleanedChunk = chunk
            .split('\n')
            .map((line) => (line.startsWith('data: ') ? line.slice(6) : line))
            .join('\n')

          totalData += cleanedChunk // 전체 데이터에 누적

          buffer += chunk

          // 연속된 JSON 객체들을 분리하여 처리
          this.processJsonBuffer(buffer, onData, (remainingBuffer) => {
            buffer = remainingBuffer
          })
        }

        // 남은 버퍼 처리
        if (buffer.trim()) {
          this.processJsonBuffer(buffer, onData, () => {})
        }
      } finally {
        reader.releaseLock()
        // 완료 시 현재 컨트롤러 해제
        if (this.currentAbortController === abortController) {
          this.currentAbortController = null
        }
      }
    } catch (error) {
    } finally {
      // 완료 시 현재 컨트롤러 해제
      if (this.currentAbortController === abortController) {
        this.currentAbortController = null
      }
    }
  }

  /**
   * 연속된 JSON 객체들을 분리하여 처리하는 메서드
   */
  private processJsonBuffer(
    buffer: string,
    onData: (data: unknown) => void,
    updateBuffer: (remainingBuffer: string) => void,
  ): void {
    let currentBuffer = buffer
    let processedCount = 0

    while (currentBuffer.trim()) {
      try {
        // JSON 객체의 시작을 찾기
        let trimmed = currentBuffer.trim()
        if (trimmed.startsWith('data: ')) {
          trimmed = trimmed.slice(6).trim()
          currentBuffer = trimmed // 잘라낸 후 다시 루프
          continue
        }

        if (!trimmed.startsWith('{')) {
          break
        }

        // 완전한 JSON 객체 찾기
        let braceCount = 0
        let jsonEnd = -1
        let inString = false
        let escaped = false

        for (let i = 0; i < trimmed.length; i++) {
          const char = trimmed[i]

          if (escaped) {
            escaped = false
            continue
          }

          if (char === '\\') {
            escaped = true
            continue
          }

          if (char === '"') {
            inString = !inString
            continue
          }

          if (!inString) {
            if (char === '{') {
              braceCount++
            } else if (char === '}') {
              braceCount--
              if (braceCount === 0) {
                jsonEnd = i
                break
              }
            }
          }
        }

        if (jsonEnd === -1) {
          break
        }

        // 완전한 JSON 객체 추출
        const jsonStr = trimmed.substring(0, jsonEnd + 1)

        try {
          const jsonData = JSON.parse(jsonStr)

          // 데이터 타입에 따른 처리
          this.handleStreamData(jsonData, onData)
          processedCount++
        } catch (parseError) {
          this.handleStreamData(
            {
              type: 'parse_error',
              error: parseError instanceof Error ? parseError.message : String(parseError),
              data: jsonStr,
            },
            onData,
          )
        }

        // 처리된 JSON 객체 제거하고 남은 부분으로 계속
        currentBuffer = trimmed.substring(jsonEnd + 1).trim()
      } catch (error) {
        break
      }
    }

    updateBuffer(currentBuffer)
  }

  /**
   * 스트리밍 데이터 타입에 따른 처리
   */
  private handleStreamData(data: any, onData: (data: unknown) => void): void {
    // 백엔드 단계별 데이터 처리
    if (data.step) {
    }
    // 기존 타입 처리 (하위 호환성)
    else if (data.type === 'status') {
    } else if (data.type === 'content') {
    } else if (data.type === 'error') {
    } else if (data.type === 'done') {
    } else if (data.type === 'raw') {
    } else if (data.type === 'event') {
    } else if (data.type === 'id') {
    } else if (data.type === 'unknown') {
    } else if (data.type === 'buffer') {
    } else if (data.type === 'buffer_error') {
    } else if (data.type === 'parse_error') {
    } else {
    }

    try {
      onData(data)
    } catch (callbackError) {}
  }

  /**
   * 대화 히스토리를 조회합니다
   * @param limit 조회할 메시지 수 (기본값: 50)
   * @returns Promise<ChatMessage[]> 메시지 배열
   */
  async getHistory(limit: number = 50): Promise<ChatMessage[]> {
    if (!this.sessionId) {
      return []
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/session/${this.sessionId}/history?limit=${limit}`,
      )

      const data: GetHistoryResponse = await response.json()

      if (data.success) {
        return data.messages
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  }

  /**
   * 현재 세션을 삭제합니다
   * @returns Promise<boolean> 삭제 성공 여부
   */
  async deleteSession(): Promise<boolean> {
    if (!this.sessionId) {
      return true
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/session/${this.sessionId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        this.sessionId = null
        this.removeSessionFromStorage()
        return true
      } else {
        throw new Error(data.error || '세션 삭제에 실패했습니다.')
      }
    } catch (error) {
      return false
    }
  }

  /**
   * 현재 세션 ID를 반환합니다
   */
  getSessionId(): string | null {
    return this.sessionId
  }

  /**
   * 새로운 대화를 시작합니다 (기존 세션 삭제 후 새 세션 생성)
   */
  async startNewChat(): Promise<string> {
    if (this.sessionId) {
      await this.deleteSession()
    }
    return await this.createSession()
  }

  /**
   * 현재 진행 중인 스트림을 중단합니다
   */
  abortCurrentStream(): void {
    if (this.currentAbortController && !this.currentAbortController.signal.aborted) {
      this.currentAbortController.abort()
      this.currentAbortController = null
    }
  }
}
