# 🚀 빠른 시작 가이드

## 설치 및 실행 (3단계)

### 1️⃣ 의존성 설치
```bash
# pnpm이 설치되어 있지 않다면
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 2️⃣ 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NODE_ENV=development
PORT=3000
```

### 3️⃣ 개발 서버 실행
```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요!

## 📌 주요 명령어

```bash
# 개발 서버 실행
pnpm dev

# Mock 데이터로 실행 (API 서버 불필요)
pnpm mock-app

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 코드 검사
pnpm lint

# TypeScript 타입 체크
pnpm type-check
```

## ⚠️ 문제 해결

### 빌드 실패 시
```bash
# node_modules 및 pnpm 캐시 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 포트 충돌 시
`.env` 파일에서 `PORT` 값을 변경하거나:
```bash
pnpm dev -- -p 3001
```

## 📚 더 알아보기

- [README.md](./README.md) - 전체 문서
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - 마이그레이션 상세 내역
