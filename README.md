# OLA Chat Frontend

한국거래소(KRX) 공지 질의응답 시스템 프론트엔드 애플리케이션입니다.

## 📚 문서

- [회원가입 플로우 상세 문서](./docs/SIGNUP_FLOW.md) - 회원가입 프로세스 전체 가이드
- [인증 시스템 빠른 참조](./docs/AUTH_README.md) - 로그인/회원가입 Quick Reference

## 🚀 시작하기

### 사전 요구사항

- Node.js 20.x 이상
- pnpm 9.x 이상 (권장 패키지 매니저)

### 설치

```bash
# pnpm이 설치되어 있지 않다면
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# API Configuration
# API 서버의 기본 URL을 설정합니다
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Environment
# 개발 환경: development, 프로덕션 환경: production
NODE_ENV=development

# Port Configuration (선택사항)
# 애플리케이션이 실행될 포트 번호
PORT=3000
```

### 개발 서버 실행

```bash
# 개발 모드로 실행 (포트 3000)
pnpm dev

# 로컬 환경 변수로 실행
pnpm local
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### Mock 서버 사용

개발 중 API 서버 없이 테스트하려면 MSW(Mock Service Worker)를 사용할 수 있습니다:

```bash
# Mock 데이터로 개발 서버 실행
pnpm mock-app

# 또는 별도의 Mock 서버 실행
pnpm mock-server
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build
```

### 프로덕션 서버 실행

```bash
# 빌드 후 프로덕션 모드로 실행
pnpm start
```

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일
├── components/             # React 컴포넌트
│   ├── chat/              # 채팅 관련 컴포넌트
│   │   └── modern/        # 모던 채팅 UI
│   ├── chart/             # 차트 컴포넌트
│   ├── question/          # 질문 관련 컴포넌트
│   ├── search/            # 검색 컴포넌트
│   └── ui/                # 공통 UI 컴포넌트 (Radix UI 기반)
├── hooks/                  # 커스텀 훅
│   ├── chat/              # 채팅 관련 훅
│   ├── modern-chat/       # 모던 채팅 훅
│   ├── data-fetching/     # 데이터 페칭 훅
│   └── common/            # 공통 훅
├── lib/                    # 유틸리티 및 설정
│   ├── http/              # HTTP 클라이언트
│   └── chat/              # 채팅 유틸리티
├── services/               # API 서비스
│   └── chat/              # 채팅 API 서비스
├── types/                  # TypeScript 타입 정의
├── http/                   # HTTP 요청 핸들러
├── providers/              # React Context Providers
├── contexts/               # React Contexts
├── constants/              # 상수 정의
└── utils/                  # 유틸리티 함수
```

## 🔧 기술 스택

- **프레임워크**: Next.js 15.3.4 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 3.4
- **UI 라이브러리**: Radix UI
- **상태 관리**: 
  - React Hooks
  - TanStack Query (React Query)
- **차트**: 
  - Recharts
  - Lightweight Charts
- **폼 관리**: React Hook Form
- **HTTP 클라이언트**: Axios
- **테스트/Mock**: MSW (Mock Service Worker)
- **코드 품질**: ESLint, TypeScript

## 🌟 주요 기능

- **질의응답 시스템**: AI 기반 공지 관련 질문과 답변
- **모던 채팅 인터페이스**: 실시간 스트리밍 채팅 UI
- **추천 질문**: 자주 묻는 질문 및 대표 질문 표시
- **차트 시각화**: 재무 데이터 및 주가 차트
- **종목 검색**: 주식 종목 검색 및 정보 조회
- **반응형 디자인**: 모바일/태블릿/데스크톱 완벽 지원
- **다크 모드**: 테마 전환 기능

## 📝 스크립트

```bash
# 개발 서버 실행 (포트 3000)
pnpm dev

# 로컬 환경으로 실행
pnpm local

# Mock 데이터로 실행
pnpm mock-app

# Mock 서버만 실행
pnpm mock-server

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint

# 타입 체크
pnpm type-check
```

## 🐳 Docker

Dockerfile이 포함되어 있어 컨테이너로 실행할 수 있습니다:

```bash
# Docker 이미지 빌드
docker build -t ola-chat-fe .

# Docker 컨테이너 실행 (환경 변수 포함)
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
  ola-chat-fe

# 또는 .env 파일 사용
docker run -p 3000:3000 --env-file .env ola-chat-fe
```

## 📚 문서

프로젝트 관련 상세 문서:

- [빠른 시작 가이드](./QUICK_START.md) - 3단계로 바로 시작
- [PNPM 사용 가이드](./PNPM_GUIDE.md) - pnpm 패키지 매니저 가이드
- [마이그레이션 요약](./MIGRATION_SUMMARY.md) - Monorepo 분리 내역
- [아키텍처 문서](./ARCHITECTURE_DOCUMENTATION.md)
- [모던 채팅 가이드](./MODERN_CHAT_GUIDE.md)
- [모던 채팅 사양](./MODERN_CHAT_SPECIFICATIONS.md)
- [Hooks 및 데이터 페칭 구조](./HOOKS_DATA_FETCHING_STRUCTURE.md)
- [Figma 디자인 시스템 통합](./FIGMA_DESIGN_SYSTEM_INTEGRATION.md)

## 🔍 주요 컴포넌트

### Modern Chat
최신 채팅 UI를 제공하는 컴포넌트 시스템:
- `ModernChatInterface`: 메인 채팅 인터페이스
- `ChatMessageList`: 메시지 목록 렌더링
- `ChatInput`: 채팅 입력 컴포넌트
- `StreamingMessage`: 스트리밍 메시지 표시

### Chart Components
다양한 차트 컴포넌트:
- `AreaChart`, `BarChart`, `LineChart`, `PieChart`
- `CandleChart`: 주가 캔들 차트
- `FinancialChartWithFinancialMetricsTabs`: 재무 데이터 차트
- `PriceChartWithTimeFrameTabs`: 가격 차트

## 🧪 개발 도구

### MSW (Mock Service Worker)
API 모킹을 위한 MSW 설정이 포함되어 있습니다:
- `msw/mock-server.ts`: Express 기반 Mock 서버
- `src/http/mockHandlers.ts`: Mock API 핸들러

### TanStack Query Devtools
React Query 개발자 도구가 개발 모드에서 자동으로 활성화됩니다.

## 🤝 개발 가이드

### 코드 스타일
- Early returns 사용
- Tailwind CSS만 사용 (인라인 CSS 지양)
- 접근성 속성 구현 (aria-label, tabindex 등)
- const 선언 선호, 함수 선언보다 화살표 함수 사용
- 이벤트 핸들러는 "handle" 접두사 사용

### 커밋 컨벤션
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드 및 설정 변경

## 📄 라이선스

이 프로젝트는 private 프로젝트입니다.

## 🔗 관련 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Radix UI 문서](https://www.radix-ui.com/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
# OLA-CHAT-FE
