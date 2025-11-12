# PNPM 사용 가이드

이 프로젝트는 **pnpm**(performant npm)을 패키지 매니저로 사용합니다.

## 🚀 pnpm이란?

pnpm은 npm과 yarn의 대안으로, 다음과 같은 장점이 있습니다:

- **빠른 설치 속도**: 심볼릭 링크를 사용하여 디스크 공간 절약 및 설치 속도 향상
- **엄격한 의존성 관리**: phantom dependencies 방지
- **효율적인 모노레포 지원**: workspace 기능 내장
- **디스크 공간 절약**: 중복 패키지 설치 방지

## 📦 pnpm 설치

### 전역 설치 (권장)

```bash
# npm을 통한 설치
npm install -g pnpm

# 또는 Homebrew (macOS)
brew install pnpm

# 또는 스크립트를 통한 설치
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 버전 확인

```bash
pnpm --version
# 9.0.0 이상이어야 합니다
```

## 🔧 주요 명령어

### 기본 명령어

```bash
# 의존성 설치
pnpm install

# 패키지 추가
pnpm add <package-name>

# 개발 의존성 추가
pnpm add -D <package-name>

# 패키지 제거
pnpm remove <package-name>

# 의존성 업데이트
pnpm update

# 특정 패키지 업데이트
pnpm update <package-name>
```

### 프로젝트 스크립트 실행

```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test

# Lint
pnpm lint
```

## 🎯 npm과의 차이점

| npm 명령어 | pnpm 명령어 | 설명 |
|-----------|------------|------|
| `npm install` | `pnpm install` | 의존성 설치 |
| `npm install <pkg>` | `pnpm add <pkg>` | 패키지 추가 |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | 패키지 제거 |
| `npm run <script>` | `pnpm <script>` | 스크립트 실행 |
| `npm update` | `pnpm update` | 패키지 업데이트 |
| `npx <command>` | `pnpm exec <command>` | 패키지 실행 |

## 📝 주요 특징

### 1. Content-addressable Storage

pnpm은 전역 저장소에 패키지를 한 번만 저장하고, 프로젝트에서는 하드 링크를 사용합니다.

```bash
# 전역 저장소 위치 확인
pnpm store path

# 저장소 정리 (사용하지 않는 패키지 제거)
pnpm store prune
```

### 2. Strict Node Modules

pnpm은 엄격한 node_modules 구조를 생성하여 phantom dependencies를 방지합니다.

### 3. Lock 파일

- **pnpm-lock.yaml**: pnpm의 lock 파일
- Git에 커밋해야 함
- 팀원 간 동일한 의존성 보장

## ⚙️ 설정 파일 (.npmrc)

프로젝트 루트의 `.npmrc` 파일에서 pnpm 동작을 설정할 수 있습니다:

```ini
# 현재 프로젝트 설정
shamefully-hoist=false          # 플랫 node_modules 구조 사용 안 함
strict-peer-dependencies=false  # peer dependencies 충돌 시 경고만 표시
prefer-frozen-lockfile=true     # lock 파일 변경 최소화
engine-strict=true              # Node 버전 체크 엄격히 적용
```

## 🔍 문제 해결

### 1. 설치 오류

```bash
# node_modules와 lock 파일 제거 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. 캐시 문제

```bash
# pnpm 캐시 정리
pnpm store prune

# 전체 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install --force
```

### 3. Peer Dependencies 경고

```bash
# 엄격 모드 해제 (.npmrc에 추가)
strict-peer-dependencies=false
```

## 📚 추가 리소스

- [pnpm 공식 문서](https://pnpm.io/)
- [pnpm vs npm vs yarn](https://pnpm.io/benchmarks)
- [Migration Guide](https://pnpm.io/migration)

## 💡 팁

### 빠른 설치를 위한 팁

```bash
# 기존 lock 파일 사용 (CI/CD에 유용)
pnpm install --frozen-lockfile

# offline 모드 (캐시된 패키지만 사용)
pnpm install --offline

# 개발 의존성 제외
pnpm install --prod
```

### 디스크 공간 절약

```bash
# 사용하지 않는 패키지 정리
pnpm store prune

# 저장소 상태 확인
pnpm store status
```

### 패키지 검색

```bash
# 패키지 검색
pnpm search <package-name>

# 패키지 정보 확인
pnpm info <package-name>
```

## 🎓 Best Practices

1. **Lock 파일 커밋**: `pnpm-lock.yaml`을 항상 Git에 커밋하세요
2. **버전 명시**: `package.json`에 `engines` 필드로 Node/pnpm 버전 명시
3. **CI/CD 설정**: `--frozen-lockfile` 옵션 사용
4. **정기적인 업데이트**: `pnpm update` 명령으로 의존성 최신 상태 유지
5. **저장소 정리**: 주기적으로 `pnpm store prune` 실행

## ⚠️ 주의사항

- npm/yarn과 혼용하지 마세요 (lock 파일 충돌 가능)
- `node_modules`를 Git에 커밋하지 마세요
- CI/CD에서 pnpm 버전을 고정하세요
