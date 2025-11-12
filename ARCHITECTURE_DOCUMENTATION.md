# IBK Chat 프로젝트 아키텍처 문서

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 패턴](#아키텍처-패턴)
5. [핵심 컴포넌트](#핵심-컴포넌트)
6. [데이터 플로우](#데이터-플로우)
7. [상태 관리](#상태-관리)
8. [API 통신](#api-통신)
9. [개발 가이드](#개발-가이드)
10. [참고 사항](#참고-사항)

## 🎯 프로젝트 개요

IBK Chat은 IBK 금융그룹의 금융 챗봇 애플리케이션으로, 사용자가 금융 관련 질문을 하고 AI가 실시간으로 답변을 제공하는 시스템입니다.

### 주요 기능
- **실시간 채팅**: AI와의 실시간 대화
- **차트 및 시각화**: 금융 데이터 시각화 (Recharts, Lightweight Charts)
- **추천 질문**: 자주 묻는 질문 및 인기 질문
- **주식 정보**: 실시간 주식 데이터 및 분석
- **마크다운 렌더링**: 구조화된 응답 표시
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## 🛠️ 기술 스택

### Frontend Framework
- **Next.js 15.3.4**: React 기반 풀스택 프레임워크
- **React 19.0.0**: 사용자 인터페이스 라이브러리
- **TypeScript**: 정적 타입 검사

### UI/UX
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Radix UI**: 접근성 중심 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리
- **Heroicons**: SVG 아이콘

### 상태 관리 & 데이터 페칭
- **TanStack Query (React Query)**: 서버 상태 관리
- **React Hooks**: 클라이언트 상태 관리

### 차트 & 시각화
- **Recharts**: React 차트 라이브러리
- **Lightweight Charts**: 금융 차트 라이브러리

### AI & 채팅
- **CopilotKit**: AI 챗봇 프레임워크
- **React Markdown**: 마크다운 렌더링

### 개발 도구
- **MSW (Mock Service Worker)**: API 모킹
- **ESLint**: 코드 품질 검사
- **PostCSS**: CSS 전처리

## 📁 프로젝트 구조

```
apps/ibk-chat/
├── 📄 package.json                 # 프로젝트 의존성 및 스크립트
├── 📄 next.config.ts              # Next.js 설정
├── 📄 tailwind.config.ts          # Tailwind CSS 설정
├── 📄 tsconfig.json               # TypeScript 설정
├── 📄 components.json             # shadcn/ui 설정
├── 📄 openapi.json                # API 스펙 정의
├── 📁 msw/                        # Mock Service Worker
│   └── 📄 mock-server.ts          # API 모킹 서버
├── 📁 public/                     # 정적 파일
│   ├── 📁 icons/                  # 아이콘 파일들
│   ├── 📁 stock/                  # 주식 관련 이미지
│   └── 📄 *.png, *.svg            # 기타 이미지 파일들
└── 📁 src/                        # 소스 코드
    ├── 📁 app/                    # Next.js App Router
    │   ├── 📄 layout.tsx          # 루트 레이아웃
    │   ├── 📄 page.tsx            # 메인 페이지
    │   ├── 📄 globals.css         # 글로벌 스타일
    │   └── 📁 pie-chart-test/     # 차트 테스트 페이지
    ├── 📁 components/             # React 컴포넌트
    │   ├── 📁 chart/              # 차트 관련 컴포넌트
    │   │   ├── 📄 ChartContainer.tsx
    │   │   ├── 📄 LineChart.tsx
    │   │   ├── 📄 PieChart.tsx
    │   │   └── 📄 ...
    │   ├── 📁 chat/               # 채팅 관련 컴포넌트
    │   │   ├── 📄 ChatContainer.tsx
    │   │   ├── 📄 ChatInput.tsx
    │   │   ├── 📄 ChatMessage.tsx
    │   │   └── 📄 ...
    │   ├── 📁 question/           # 질문 관련 컴포넌트
    │   │   ├── 📄 QuestionList.tsx
    │   │   └── 📄 QuestionItem.tsx
    │   ├── 📁 ui/                 # 공통 UI 컴포넌트
    │   │   ├── 📄 Button.tsx
    │   │   ├── 📄 Card.tsx
    │   │   ├── 📄 Input.tsx
    │   │   └── 📄 ...
    │   └── 📄 MainContent.tsx     # 메인 콘텐츠 컴포넌트
    ├── 📁 constants/              # 상수 정의
    │   ├── 📄 config.ts           # 앱 설정
    │   ├── 📄 chat.ts             # 채팅 관련 상수
    │   └── 📁 editor/             # 에디터 관련 상수
    ├── 📁 hooks/                  # 커스텀 훅
    │   ├── 📁 chat/               # 채팅 관련 훅
    │   │   ├── 📄 useChat.ts
    │   │   ├── 📄 useChatHistory.ts
    │   │   └── 📄 ...
    │   ├── 📁 data-fetching/      # 데이터 페칭 훅
    │   │   ├── 📄 useStocks.ts
    │   │   ├── 📄 useRecommendations.ts
    │   │   └── 📄 ...
    │   ├── 📁 modern-chat/        # 모던 채팅 훅
    │   └── 📄 index.ts            # 훅 export
    ├── 📁 http/                   # HTTP 클라이언트
    │   ├── 📁 dataset/            # 데이터셋 API
    │   ├── 📁 recommend/          # 추천 API
    │   ├── 📁 stocks/             # 주식 API
    │   ├── 📄 index.ts            # HTTP 클라이언트 설정
    │   └── 📄 mockHandlers.ts     # MSW 핸들러
    ├── 📁 lib/                    # 유틸리티 라이브러리
    │   ├── 📄 chatClient.ts       # 채팅 클라이언트
    │   ├── 📄 object.ts           # 객체 유틸리티
    │   ├── 📄 simpleEncrypt.ts    # 암호화 유틸리티
    │   └── 📁 http/               # HTTP 유틸리티
    ├── 📁 providers/              # React Provider
    │   ├── 📄 ReactQueryProvider.tsx
    │   ├── 📄 DataSetProvider.tsx
    │   └── 📄 index.tsx
    ├── 📁 services/               # 비즈니스 로직 서비스
    │   ├── 📁 chat/               # 채팅 서비스
    │   │   ├── 📄 chatService.ts
    │   │   ├── 📄 messageService.ts
    │   │   └── 📄 ...
    │   └── 📄 index.ts            # 서비스 export
    ├── 📁 types/                  # TypeScript 타입 정의
    │   ├── 📁 auth/               # 인증 관련 타입
    │   ├── 📁 chat/               # 채팅 관련 타입
    │   ├── 📁 chart/              # 차트 관련 타입
    │   ├── 📁 dataSet/            # 데이터셋 타입
    │   ├── 📁 editor/             # 에디터 타입
    │   ├── 📁 question/           # 질문 관련 타입
    │   ├── 📁 recommend/          # 추천 관련 타입
    │   ├── 📁 stocks/             # 주식 관련 타입
    │   ├── 📁 common/             # 공통 타입
    │   ├── 📄 api.ts              # API 타입
    │   ├── 📄 chat.ts             # 채팅 타입
    │   ├── 📄 modern-chat.ts      # 모던 채팅 타입
    │   ├── 📄 question.ts         # 질문 타입
    │   ├── 📄 ui.ts               # UI 타입
    │   ├── 📄 user.ts             # 사용자 타입
    │   └── 📄 index.ts            # 타입 export
    └── 📁 utils/                  # 유틸리티 함수
        ├── 📄 chatUtils.ts        # 채팅 유틸리티
        └── 📄 index.ts            # 유틸리티 export
```

## 🏗️ 아키텍처 패턴

### 1. 계층형 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────┐
│           Presentation Layer        │ ← components/, app/
├─────────────────────────────────────┤
│           Business Logic Layer      │ ← hooks/, services/
├─────────────────────────────────────┤
│           Data Access Layer         │ ← http/, lib/
├─────────────────────────────────────┤
│           External Services         │ ← API, MSW
└─────────────────────────────────────┘
```

### 2. 컴포넌트 기반 아키텍처

- **Atomic Design**: UI 컴포넌트를 원자 단위로 구성
- **Composition Pattern**: 컴포넌트 조합을 통한 재사용성
- **Container/Presentational Pattern**: 로직과 표현 분리

### 3. 도메인 주도 설계 (DDD)

각 도메인별로 폴더를 분리하여 관리:
- `chat/`: 채팅 관련 기능
- `stocks/`: 주식 관련 기능
- `question/`: 질문 관련 기능
- `chart/`: 차트 관련 기능

## 🔧 핵심 컴포넌트

### 1. ChatClient (`lib/chatClient.ts`)
```typescript
class ChatClient {
  // 세션 관리
  async createSession(): Promise<string>
  async deleteSession(): Promise<boolean>
  
  // 메시지 전송
  async sendMessage(message: string): Promise<string>
  async sendMessageStream(message: string, onData: Function): Promise<void>
  
  // 히스토리 관리
  async getHistory(limit: number): Promise<ChatMessage[]>
}
```

### 2. ReactQueryProvider (`providers/ReactQueryProvider.tsx`)
```typescript
// 서버 상태 관리 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### 3. MainContent (`components/MainContent.tsx`)
메인 레이아웃을 담당하는 컨테이너 컴포넌트

## 🔄 데이터 플로우

### 1. 채팅 메시지 플로우
```
User Input → ChatInput → useChat Hook → ChatClient → API → Response → ChatMessage
```

### 2. 데이터 페칭 플로우
```
Component → useQuery Hook → HTTP Client → API → Cache → Component Update
```

### 3. 상태 관리 플로우
```
Local State (useState) → Component State
Server State (useQuery) → React Query Cache
Global State → Context API (필요시)
```

## 📊 상태 관리

### 1. 클라이언트 상태
- **React Hooks**: `useState`, `useReducer`
- **컴포넌트별 상태**: 각 컴포넌트 내부 상태 관리

### 2. 서버 상태
- **TanStack Query**: API 데이터 캐싱 및 동기화
- **자동 백그라운드 업데이트**: 설정된 staleTime에 따라 자동 갱신

### 3. 전역 상태
- **Context API**: 테마, 사용자 정보 등
- **Provider 패턴**: ReactQueryProvider, DataSetProvider

## 🌐 API 통신

### 1. HTTP 클라이언트 구조
```
http/
├── index.ts              # 기본 설정
├── mockHandlers.ts       # MSW 핸들러
├── dataset/              # 데이터셋 API
├── recommend/            # 추천 API
└── stocks/               # 주식 API
```

### 2. API 호출 패턴
```typescript
// 커스텀 훅을 통한 API 호출
const { data, isLoading, error } = useQuery({
  queryKey: ['stocks'],
  queryFn: () => stocksApi.getStocks(),
})
```

### 3. 에러 처리
- **React Query**: 자동 에러 처리 및 재시도
- **Error Boundary**: 컴포넌트 레벨 에러 처리
- **Toast 알림**: 사용자 친화적 에러 메시지

## 🚀 개발 가이드

### 1. 새 컴포넌트 생성
```bash
# 컴포넌트 생성
mkdir src/components/new-feature
touch src/components/new-feature/NewComponent.tsx
touch src/components/new-feature/index.ts

# 타입 정의
touch src/types/new-feature.ts
```

### 2. 새 API 엔드포인트 추가
```bash
# HTTP 클라이언트 추가
mkdir src/http/new-api
touch src/http/new-api/index.ts

# 훅 생성
touch src/hooks/data-fetching/useNewApi.ts

# 타입 정의
touch src/types/new-api.ts
```

### 3. 스타일링 가이드
- **Tailwind CSS**: 유틸리티 클래스 우선 사용
- **Radix UI**: 접근성 고려한 컴포넌트 사용
- **커스텀 CSS**: 필요한 경우에만 사용

### 4. 타입 정의 가이드
```typescript
// 인터페이스 정의
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 타입 가드
function isApiResponse(obj: any): obj is ApiResponse<any> {
  return obj && typeof obj.success === 'boolean'
}
```

## 📝 참고 사항

### 1. 개발 스크립트
```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 타입 체크
pnpm type-check

# 린트 검사
pnpm lint

# Mock 서버 실행
pnpm mock-server
```

### 2. 환경 변수
```env
NEXT_PUBLIC_API_BASE_URL=
```

### 3. 주요 의존성
- **@ola-b2b/ui**: 공통 UI 컴포넌트
- **@ola-b2b/fonts**: 폰트 패키지
- **@ola-b2b/tailwind-preset**: Tailwind 설정

### 4. 문서 참조
- [MODERN_CHAT_SPECIFICATIONS.md](./MODERN_CHAT_SPECIFICATIONS.md)
- [MODERN_CHAT_GUIDE.md](./MODERN_CHAT_GUIDE.md)
- [FIGMA_DESIGN_SYSTEM_INTEGRATION.md](./FIGMA_DESIGN_SYSTEM_INTEGRATION.md)

---

이 문서는 IBK Chat 프로젝트의 아키텍처를 이해하고 다른 프로젝트에서 참고할 수 있도록 작성되었습니다. 프로젝트 구조나 기술 스택이 변경될 경우 이 문서도 함께 업데이트해주세요. 