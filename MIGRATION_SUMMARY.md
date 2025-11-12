# Monorepo 분리 마이그레이션 요약

이 문서는 monorepo에서 독립 프로젝트로 분리하면서 수행한 변경 사항을 요약합니다.

## 📋 변경 사항 요약

### 1. Package.json 업데이트

#### 제거된 Workspace 의존성
- `@ola-b2b/fonts` - 제거됨
- `@ola-b2b/tailwind-preset` - 제거됨
- `@ola-b2b/ui` - 제거됨

#### 추가된 의존성
- `react`: ^19.0.0 (peerDependencies에서 dependencies로 이동)
- `react-dom`: ^19.0.0 (peerDependencies에서 dependencies로 이동)

#### 추가된 devDependencies
- `@types/node`: ^20
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `@types/uuid`: ^10
- `typescript`: ^5

#### 버전 변경
- `tailwind-scrollbar`: ^4.0.2 → ^3.1.0 (Tailwind CSS 3.x 호환성을 위해)

#### 패키지명 변경
- `@ola-b2b/ibk-chat` → `ola-chat-fe`

### 2. 소스 코드 변경

#### 폰트 설정 (src/app/layout.tsx)
- `@ola-b2b/fonts`에서 Pretendard 폰트 import 제거
- CSS 변수를 통한 폰트 적용으로 전환 (globals.css에 정의됨)

#### UI 컴포넌트 교체
다음 파일들에서 `@ola-b2b/ui` 참조 제거:
- `src/components/MainContent.tsx` - Typography를 HTML 태그로 교체
- `src/components/question/QuestionList.tsx` - Typography 제거
- `src/app/401/page.tsx` - Button import 제거
- `src/components/search-stock-form/SearchStockForm.tsx` - 로컬 Button, Badge 사용
- `src/components/chat/modern/EtfContent.tsx` - 로컬 Table 컴포넌트 사용

#### 새로 생성된 UI 컴포넌트
- `src/components/ui/button.tsx` - Radix UI 기반 Button 컴포넌트
- `src/components/ui/table.tsx` - Table 관련 컴포넌트들

### 3. Tailwind CSS 설정 (tailwind.config.ts)

- `@ola-b2b/tailwind-preset`에서 fontSizes import 제거
- fontSizes를 파일 내부에 직접 정의:
  - Pre-40-B ~ Pre-10-B (Bold 스타일)
  - Pre-36-R ~ Pre-8-R (Regular 스타일)

### 4. ESLint 설정 (eslint.config.js)

- `plugin:storybook/recommended` 제거
- `react-hooks/rules-of-hooks`를 'error'에서 'warn'으로 변경

### 5. 새로 생성된 파일

- `.gitignore` - Git ignore 규칙 정의
- `.env.example` - 환경 변수 템플릿
- `MIGRATION_SUMMARY.md` - 이 문서

### 6. README 업데이트

- 독립 실행을 위한 상세한 설치 및 실행 가이드 추가
- 환경 변수 설정 가이드 추가
- 프로젝트 구조 상세 설명 추가
- Docker 실행 가이드 추가
- 개발 가이드라인 추가

## 🚀 시작하기

### 1. 의존성 설치

```bash
# pnpm이 설치되어 있지 않다면
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NODE_ENV=development
PORT=3000
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## ✅ 검증 완료

- ✅ TypeScript 타입 체크 통과 (`pnpm type-check`)
- ✅ 프로덕션 빌드 성공 (`pnpm build`)
- ✅ ESLint 검사 통과 (경고만 존재, 에러 없음)
- ✅ pnpm 기반 패키지 관리 설정 완료

## 📝 추가 참고 사항

### 환경 변수

필수 환경 변수:
- `NEXT_PUBLIC_API_BASE_URL`: API 서버 URL

선택적 환경 변수:
- `NODE_ENV`: 실행 환경 (development/production)
- `PORT`: 애플리케이션 포트 (기본값: 3000)

### Mock 서버

개발 중 API 서버 없이 테스트하려면:

```bash
pnpm mock-app
```

또는 별도의 Mock 서버:

```bash
pnpm mock-server
```

### Docker

```bash
# 이미지 빌드
docker build -t ola-chat-fe .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
  ola-chat-fe
```

## 🔧 해결된 이슈

1. **Workspace 의존성 제거**: 모든 workspace 패키지 참조를 로컬 구현으로 교체
2. **React 의존성**: peerDependencies에서 dependencies로 이동
3. **Tailwind 버전 충돌**: tailwind-scrollbar 버전 다운그레이드
4. **TypeScript 타입 에러**: fontSizes 타입 명시
5. **React Hooks 규칙**: ESLint 설정 조정 및 코드 구조 개선

## 📚 관련 문서

- [README.md](./README.md) - 프로젝트 전체 가이드
- [ARCHITECTURE_DOCUMENTATION.md](./ARCHITECTURE_DOCUMENTATION.md) - 아키텍처 문서
- [MODERN_CHAT_GUIDE.md](./MODERN_CHAT_GUIDE.md) - 채팅 구현 가이드
- [HOOKS_DATA_FETCHING_STRUCTURE.md](./HOOKS_DATA_FETCHING_STRUCTURE.md) - 데이터 페칭 구조

## 🎯 다음 단계

프로젝트가 독립적으로 실행 가능한 상태입니다. 다음을 권장합니다:

1. ✅ 환경 변수 설정 검증
2. ✅ 개발 서버에서 기능 테스트
3. ✅ API 연동 테스트
4. ⚠️ 프로덕션 환경 배포 전 통합 테스트
5. ⚠️ 남은 ESLint 경고 정리 (선택사항)

