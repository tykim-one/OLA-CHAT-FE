# 🎨 Modern Chat System - 기능별 명세서

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [핵심 컴포넌트](#핵심-컴포넌트)
3. [상태 관리](#상태-관리)
4. [UI/UX 기능](#uiux-기능)
5. [API 연동](#api-연동)
6. [타입 정의](#타입-정의)
7. [설정 및 구성](#설정-및-구성)

---

## 🎯 시스템 개요

### 주요 목적
- Figma 디자인 기반의 현대적인 채팅 인터페이스 구현
- 실시간 AI 챗봇과의 대화 기능 제공
- 추천 질문 및 인기 콘텐츠 제시
- 반응형 디자인으로 다양한 화면 크기 지원

### 기술 스택
- **Frontend**: React 18, TypeScript, Next.js
- **Styling**: TailwindCSS
- **State Management**: React Hooks (useState, useCallback, useEffect)
- **API**: 스트리밍 기반 실시간 통신

---

## 🧩 핵심 컴포넌트

### 1. ModernChatContainer
**역할**: 전체 채팅 인터페이스의 메인 컨테이너
```typescript
interface ModernChatContainerProps {
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
```

**주요 기능**:
- 채팅 상태에 따른 다른 UI 렌더링
- 메시지 목록 또는 환영 화면 표시
- 반응형 레이아웃 제공

### 2. ModernChatMessageList
**역할**: 채팅 메시지들을 스크롤 가능한 목록으로 표시

**주요 기능**:
- 사용자 메시지와 AI 응답 구분 표시
- 자동 스크롤 (새 메시지 시 맨 아래로 이동)
- 로딩 상태 표시
- 커스텀 스크롤바 스타일링

### 3. ModernChatInput
**역할**: 사용자 입력을 받는 입력 필드

**주요 기능**:
- Enter 키로 메시지 전송
- 실시간 입력 상태 표시
- 전송 버튼 활성화/비활성화
- 포커스 상태 관리
- 로딩 중 입력 차단

**상태 종류**:
- `default`: 기본 상태
- `focused`: 포커스된 상태
- `loading`: 로딩 중 상태

### 4. WelcomeSection
**역할**: 첫 방문 사용자를 위한 환영 메시지

**주요 기능**:
- 사용자 친화적인 인사말
- 챗봇 사용법 안내
- 아이콘 표시 옵션

### 5. RecommendedContent
**역할**: 추천 질문과 인기 콘텐츠 제공

**주요 기능**:
- 탭 기반 콘텐츠 분류
- 카테고리별 질문 필터링
- 클릭 가능한 질문 버튼

**카테고리**:
- 💡 추천 질문
- 🔥 실시간 인기 질문  
- 📊 오늘의 인기 종목

### 6. Chat Bubbles

#### UserBubble
- 사용자 메시지 표시
- 오른쪽 정렬
- 파란색 배경

#### AssistantBubble  
- AI 응답 메시지 표시
- 왼쪽 정렬
- 회색 배경
- 스트리밍 효과 표시

#### LoadingBubble
- AI 응답 대기 중 표시
- 애니메이션 점 효과
- 진행 상황 메시지

---

## 🔄 상태 관리

### ModernChatState
```typescript
type ModernChatState = 
  | 'idle'              // 대기 상태
  | 'user_typing'       // 사용자 입력 중
  | 'message_sending'   // 메시지 전송 중
  | 'ai_loading'        // AI 응답 대기 중
  | 'response_rendered' // 응답 완료
```

### 상태 전환 플로우
```
idle → user_typing → message_sending → ai_loading → idle
```

### useChatContainer Hook
**역할**: 채팅 시스템의 전체 상태와 로직 관리

**제공 기능**:
```typescript
const {
  // 상태
  chatState,
  messages,
  inputValue,
  activeTab,
  isLoading,
  error,
  sessionId,
  loadingState,
  
  // 액션
  sendMessage,
  handleQuestionClick,
  handleTabChange,
  setInputValue,
  resetChat,
  clearError
} = useChatContainer(options)
```

---

## 🎨 UI/UX 기능

### 반응형 디자인
- **최대 너비**: 480px
- **높이**: 사용자 정의 가능 (기본값: 700px)
- **모바일 최적화**: 터치 인터페이스 지원

### 접근성 (Accessibility)
- **키보드 네비게이션**: Tab, Enter 키 지원
- **ARIA 라벨**: 스크린 리더 지원
- **포커스 관리**: 명확한 포커스 표시
- **색상 대비**: WCAG 가이드라인 준수

### 인터렙션
- **호버 효과**: 버튼과 질문에 부드러운 호버 효과
- **클릭 피드백**: 시각적 피드백 제공
- **애니메이션**: 부드러운 전환 애니메이션
- **스크롤**: 커스텀 스크롤바 디자인

---

## 🔌 API 연동

### 실시간 스트리밍
```typescript
// 스트리밍 응답 처리
await chatService.sendMessageStream(message, (data) => {
  // 실시간 응답 데이터 처리
  if (data.type === 'final_answer') {
    // 최종 응답 표시
  } else if (data.step) {
    // 진행 상황 표시
  }
})
```

### Mock 모드
- **개발/테스트**: API 서버 없이 테스트 가능
- **가짜 응답**: 실제 API와 동일한 패턴의 응답 생성
- **2초 지연**: 실제 API 응답 시간 시뮬레이션

### 에러 처리
- **네트워크 오류**: 재시도 메커니즘
- **API 오류**: 사용자 친화적 에러 메시지
- **타임아웃**: 적절한 타임아웃 설정

---

## 📝 타입 정의

### 핵심 타입

#### ModernChatMessage
```typescript
interface ModernChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
  type?: 'query' | 'answer' | 'loading'
}
```

#### TabOption
```typescript
interface TabOption {
  id: string
  label: string
  emoji?: string
  isSelected?: boolean
}
```

#### RecommendedQuestion
```typescript
interface RecommendedQuestion {
  id: string
  text: string
  category: string
}
```

---

## ⚙️ 설정 및 구성

### 기본 설정
```typescript
// 환영 메시지 설정
export const welcomeConfig = {
  title: "안녕하세요!",
  subtitle: "챗봇이 데이터로 똑똑하게 분석드려요.😊\n투자 전 꼭 본인의 판단도 함께 확인해 주세요!",
  showIcon: false
}

// 탭 옵션 설정
export const mockTabOptions = [
  { id: 'recommended', label: '💡 추천 질문', isSelected: true },
  { id: 'popular', label: '🔥 실시간 인기 질문', isSelected: false },
  { id: 'stocks', label: '📊 오늘의 인기 종목', isSelected: false }
]
```

### 추천 질문 데이터
```typescript
export const mockQuestions = [
  { id: '1', text: 'Is Samsung Electronics undervalued?', category: 'recommended' },
  { id: '2', text: '애플(AAPL) 주가 전망은 어떤가요?', category: 'recommended' },
  { id: '3', text: '테슬라 최근 실적 분석해주세요', category: 'recommended' },
  // ... 더 많은 질문들
]
```

### 스타일링 설정
```typescript
// 컨테이너 스타일
className: "max-w-[480px] w-full rounded-[8px] border border-[#CBD5E1] bg-white"

// 입력 필드 스타일  
className: "flex-1 px-4 py-3 rounded-[20px] text-body-medium"

// 버튼 스타일
className: "px-3.5 py-1.5 bg-white border border-slate-200 rounded-[18px]"
```

---

## 🚀 사용 예제

### 기본 사용법
```typescript
function ChatPage() {
  const chatContainer = useChatContainer({
    initialState: 'idle',
    welcomeConfig: welcomeConfig,
    recommendedConfig: {
      title: "처음이시라면 아래의 추천 콘텐츠를 확인하세요!",
      icon: <VerifiedIcon />,
      tabs: mockTabOptions,
      questions: mockQuestions
    }
  })

  return (
    <ModernChatContainer
      {...chatContainer}
      height="700px"
      showWelcomeMessage={true}
      showRecommendedContent={true}
    />
  )
}
```

### 커스터마이징
```typescript
// 커스텀 높이 설정
<ModernChatContainer height="500px" />

// 환영 메시지 숨김
<ModernChatContainer showWelcomeMessage={false} />

// 커스텀 스타일링
<ModernChatContainer className="shadow-xl border-2" />
```

---

## 🐛 알려진 이슈 및 해결책

### 1. 로딩 상태 관리
**문제**: Mock 모드에서 isLoading 상태가 제대로 해제되지 않음
**해결**: Promise 기반 비동기 처리로 실제 API와 동일한 패턴 적용

### 2. 메시지 타입 불일치  
**문제**: 컴포넌트 간 메시지 타입 불일치
**해결**: 일관된 타입 정의 및 변환 로직 적용

### 3. 스크롤 위치
**문제**: 새 메시지 시 스크롤이 자동으로 이동하지 않음
**해결**: useEffect와 scrollIntoView API 활용

---

## 📈 성능 최적화

### 1. 메모이제이션
- useCallback을 통한 함수 메모이제이션
- 불필요한 리렌더링 방지

### 2. 지연 로딩
- 이미지 지연 로딩
- 컴포넌트 코드 스플리팅

### 3. 상태 관리 최적화
- 구체적인 의존성 배열 지정
- 상태 업데이트 최소화

---

## 🔮 향후 개선 계획

### 1. 기능 추가
- [ ] 파일 업로드 지원
- [ ] 음성 메시지 기능
- [ ] 다국어 지원
- [ ] 테마 변경 기능

### 2. 성능 개선
- [ ] 가상화된 메시지 목록
- [ ] 이미지 최적화
- [ ] PWA 지원

### 3. 접근성 개선
- [ ] 키보드 단축키
- [ ] 고대비 모드
- [ ] 폰트 크기 조절

---

## 📞 문의 및 지원

개발팀 연락처: [이메일 주소]
문서 업데이트: 2024년 기준
버전: v1.0.0 