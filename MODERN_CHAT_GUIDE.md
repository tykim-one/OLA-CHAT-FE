# 🎨 Modern Chat System Guide

Figma 디자인을 기반으로 구현된 재사용 가능한 채팅 컴포넌트 시스템입니다.

## 📋 목차
- [개요](#개요)
- [컴포넌트 구조](#컴포넌트-구조)
- [설치 및 사용법](#설치-및-사용법)
- [API 문서](#api-문서)
- [상태 관리](#상태-관리)
- [커스터마이징](#커스터마이징)
- [데모](#데모)

## 🚀 개요

이 모던 채팅 시스템은 다음과 같은 특징을 가집니다:

### ✨ 주요 특징
- 🎨 **Figma 디자인 기반**: 정확한 디자인 구현
- 🔄 **상태 기반 UI**: 5가지 채팅 상태에 따른 동적 인터페이스
- 🧩 **재사용 가능**: 다른 프로젝트에서 쉽게 사용 가능
- 📱 **반응형**: 다양한 화면 크기 지원
- ♿ **접근성**: WAI-ARIA 지침 준수
- 🎭 **타입 안전**: TypeScript로 완전한 타입 정의

### 🔄 채팅 상태 흐름
```
idle → user_typing → message_sending → ai_loading → response_rendered → idle
```

## 🏗️ 컴포넌트 구조

```
src/components/chat/modern/
├── ModernChatContainer.tsx        # 🏠 메인 컨테이너
├── WelcomeSection.tsx            # 👋 환영 메시지
├── RecommendedContent.tsx        # 💡 추천 콘텐츠
├── TabMenu.tsx                   # 📑 탭 메뉴
├── QuestionList.tsx              # ❓ 질문 목록
├── ModernChatInput.tsx           # ⌨️ 입력 필드
├── ModernChatMessageList.tsx     # 📝 메시지 목록
├── LoadingDots.tsx               # ⏳ 로딩 애니메이션
└── bubbles/
    ├── ModernChatBubble.tsx      # 💬 메인 버블
    ├── UserBubble.tsx            # 👤 사용자 버블
    ├── AssistantBubble.tsx       # 🤖 AI 버블
    └── LoadingBubble.tsx         # ⏳ 로딩 버블

src/hooks/modern-chat/
└── useChatContainer.ts           # 🎣 상태 관리 훅

src/types/
└── modern-chat.ts                # 📝 타입 정의
```

## 🛠️ 설치 및 사용법

### 1. 기본 사용법

```tsx
'use client'

import { ModernChatContainer, useChatContainer } from '@/components/chat/modern'

export default function ChatPage() {
  // 채팅 상태 관리 훅
  const {
    chatState,
    messages,
    inputValue,
    activeTab,
    sendMessage,
    handleQuestionClick,
    handleTabChange,
    setInputValue,
  } = useChatContainer({
    welcomeConfig: {
      title: "안녕하세요!",
      subtitle: "챗봇이 데이터로 똑똑하게 분석드려요.😊"
    },
    recommendedConfig: {
      title: "처음이시라면 아래의 추천 콘텐츠를 확인하세요!",
      tabs: [
        { id: 'recommended', label: '💡 추천 질문' },
        { id: 'popular', label: '🔥 실시간 인기 질문' }
      ],
      questions: []
    }
  })

  return (
    <ModernChatContainer
      chatState={chatState}
      messages={messages}
      onSendMessage={sendMessage}
      onQuestionClick={handleQuestionClick}
      onTabChange={handleTabChange}
      inputValue={inputValue}
      onInputChange={setInputValue}
      // ... 기타 props
    />
  )
}
```

### 2. 개별 컴포넌트 사용

```tsx
import { 
  WelcomeSection, 
  RecommendedContent,
  ModernChatBubble 
} from '@/components/chat/modern'

// 환영 섹션만 사용
<WelcomeSection
  title="안녕하세요!"
  subtitle="도움이 필요하시면 언제든 말씀해 주세요."
/>

// 추천 콘텐츠만 사용
<RecommendedContent
  title="추천 질문"
  tabs={tabs}
  questions={questions}
  activeTab="recommended"
  onTabChange={handleTabChange}
  onQuestionClick={handleQuestionClick}
/>

// 개별 버블 사용
<ModernChatBubble
  type="user"
  content="안녕하세요!"
  timestamp={new Date()}
/>
```

## 📚 API 문서

### ModernChatContainer Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `chatState` | `ModernChatState` | - | 현재 채팅 상태 |
| `messages` | `ModernChatMessage[]` | - | 메시지 배열 |
| `recommendedQuestions` | `RecommendedQuestion[]` | `[]` | 추천 질문 목록 |
| `tabOptions` | `TabOption[]` | `[]` | 탭 옵션 |
| `welcomeConfig` | `WelcomeConfig` | - | 환영 메시지 설정 |
| `recommendedConfig` | `RecommendedConfig` | - | 추천 콘텐츠 설정 |
| `onSendMessage` | `(message: string) => void` | - | 메시지 전송 핸들러 |
| `onQuestionClick` | `(question: string) => void` | - | 질문 클릭 핸들러 |
| `onTabChange` | `(tab: string) => void` | - | 탭 변경 핸들러 |
| `showWelcomeMessage` | `boolean` | `true` | 환영 메시지 표시 여부 |
| `showRecommendedContent` | `boolean` | `true` | 추천 콘텐츠 표시 여부 |
| `className` | `string` | `''` | 추가 CSS 클래스 |
| `height` | `string` | `'calc(100vh - 15rem)'` | 컨테이너 높이 |

### useChatContainer Hook

```tsx
const {
  // 상태
  chatState,      // 현재 채팅 상태
  messages,       // 메시지 배열
  inputValue,     // 입력 필드 값
  activeTab,      // 활성 탭
  isLoading,      // 로딩 상태
  error,          // 에러 메시지

  // 액션
  sendMessage,         // 메시지 전송
  handleQuestionClick, // 질문 클릭 처리
  handleTabChange,     // 탭 변경 처리
  setInputValue,       // 입력값 변경
  clearError,          // 에러 해제
  resetChat            // 채팅 초기화
} = useChatContainer(config)
```

## 🎭 상태 관리

### 채팅 상태 (ModernChatState)

| 상태 | 설명 | UI 변화 |
|------|------|---------|
| `idle` | 초기/대기 상태 | 환영 메시지 + 추천 콘텐츠 표시 |
| `user_typing` | 사용자 입력 중 | 입력 필드 포커스 상태 |
| `message_sending` | 메시지 전송 중 | 입력 필드 비활성화 |
| `ai_loading` | AI 응답 대기 중 | 로딩 버블 표시 |
| `response_rendered` | 응답 완료 | AI 응답 표시 |

### 메시지 타입 (ModernChatMessage)

```tsx
interface ModernChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
  type?: 'query' | 'answer' | 'loading'
}
```

## 🎨 커스터마이징

### 1. 테마 커스터마이징

```tsx
// Tailwind CSS 클래스로 스타일 커스터마이징
<ModernChatContainer
  className="bg-blue-50 border-blue-200"
  // ...
/>
```

### 2. 컴포넌트 확장

```tsx
// 커스텀 버블 컴포넌트
const CustomBubble = ({ message }) => {
  return (
    <div className="my-custom-bubble">
      <AssistantBubble message={message} />
      <CustomActionButtons />
    </div>
  )
}
```

### 3. 추천 질문 커스터마이징

```tsx
const customQuestions = [
  {
    id: '1',
    text: '맞춤형 질문입니다',
    category: 'custom'
  }
]

const customTabs = [
  {
    id: 'custom',
    label: '🔧 맞춤 질문',
    isSelected: true
  }
]
```

## 🎮 데모

데모 페이지에서 실제 동작을 확인할 수 있습니다:

```bash
# 개발 서버 실행
npm run dev

# 데모 페이지 접속
http://localhost:3000/modern-chat-demo
```

### 데모 기능
- ✅ 모든 채팅 상태 테스트
- ✅ 추천 질문 클릭
- ✅ 탭 전환
- ✅ 메시지 전송
- ✅ 실시간 상태 표시
- ✅ 채팅 초기화

## 🚨 주의사항

### 1. 의존성
- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+

### 2. 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 3. 성능 최적화
- 메시지가 많을 때는 가상화(virtualization) 고려
- 이미지/파일 업로드 시 적절한 크기 제한
- API 호출 시 debouncing 적용

## 🤝 기여 가이드

1. **이슈 등록**: 버그나 기능 요청은 이슈로 등록
2. **브랜치 생성**: `feature/새기능` 또는 `fix/버그수정`
3. **코드 스타일**: ESLint + Prettier 설정 준수
4. **테스트**: 새로운 기능은 테스트 코드 작성
5. **문서화**: README 업데이트

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

더 자세한 정보가 필요하시면 개발 팀에 문의해 주세요! 🚀 