# IBK Chat Hooks Data Fetching 구조 문서

## 📁 폴더 구조

```
src/hooks/data-fetching/
├── 📄 index.ts                    # 메인 export 파일
├── 📄 useQuestions.ts             # 질문 데이터 관리 훅
├── 📁 dataset/                    # 데이터셋 관련 훅
│   ├── 📄 hooks.tsx              # 데이터셋 훅들
│   ├── 📄 index.ts               # 데이터셋 export
│   ├── 📄 keys.ts                # 쿼리 키 정의
│   ├── 📄 options.ts             # 쿼리 옵션 (비어있음)
│   └── 📄 transform.tsx          # 데이터 변환 함수
├── 📁 recommend/                  # 추천 관련 훅
│   ├── 📄 hooks.tsx              # 추천 훅들
│   ├── 📄 index.tsx              # 추천 export
│   ├── 📄 keys.tsx               # 쿼리 키 정의
│   ├── 📄 options.tsx            # 쿼리 옵션
│   └── 📄 transforms.tsx         # 데이터 변환 함수
└── 📁 stocks/                     # 주식 관련 훅
    ├── 📄 hooks.tsx              # 주식 훅들
    ├── 📄 index.tsx              # 주식 export
    ├── 📄 keys.tsx               # 쿼리 키 정의
    ├── 📄 options.tsx            # 쿼리 옵션
    └── 📄 transforms.tsx         # 데이터 변환 함수
```

## 📋 각 파일의 역할

### 1. **index.ts** - 메인 Export 파일
```typescript
export * from './useQuestions'
```
- 모든 data-fetching 훅들을 중앙에서 export
- 다른 컴포넌트에서 쉽게 import할 수 있도록 함

### 2. **useQuestions.ts** - 질문 데이터 관리
```typescript
export interface UseQuestionsReturn {
  // 상태
  questions: QuestionItem[]
  questionConfig: QuestionConfig | null
  tabOptions: any[]
  isLoading: boolean
  error: string | null

  // 액션
  refreshQuestions: () => Promise<void>
  getQuestionsByCategory: (category: string) => QuestionItem[]
  clearError: () => void
}
```
- **역할**: 질문 데이터의 상태 관리 및 비즈니스 로직
- **특징**: React Query를 사용하지 않고 useState로 상태 관리
- **사용처**: 추천 질문, 인기 질문 등의 UI 컴포넌트

### 3. **도메인별 폴더 구조** (dataset, recommend, stocks)

각 도메인 폴더는 동일한 구조를 가집니다:

#### **hooks.tsx** - 실제 훅 구현
```typescript
export const useGetStockListQuery = (
  request?: ReadAllOlasecuritiesRequest,
  options?: StockListQueryOptions,
) => {
  return useQuery(getStockListQueryOptions(request, options))
}
```
- **역할**: React Query 훅들의 실제 구현
- **특징**: options.tsx의 설정을 사용하여 훅 생성

#### **index.tsx** - 도메인별 Export
```typescript
export * from './hooks'
export * from './keys'
export * from './options'
export * from './transforms'
```
- **역할**: 해당 도메인의 모든 기능을 export

#### **keys.tsx** - 쿼리 키 정의
```typescript
export const keys = {
  GET_STOCK_LIST: () => ['getStockList'],
} as const
```
- **역할**: React Query의 쿼리 키를 중앙에서 관리
- **장점**: 쿼리 키 중복 방지, 타입 안정성

#### **options.tsx** - 쿼리 옵션 설정
```typescript
export const getStockListQueryOptions = (
  request?: ReadAllOlasecuritiesRequest,
  options?: StockListQueryOptions,
) => ({
  ...options,
  queryKey: keys.GET_STOCK_LIST(),
  queryFn: async () => {
    const response = await api.readAllOlasecurities(request)
    return response.data.map(transformOlaSecurityDetailDTO)
  },
})
```
- **역할**: React Query의 쿼리 옵션을 설정
- **특징**: API 호출, 데이터 변환, 에러 처리 등을 포함

#### **transforms.tsx** - 데이터 변환
```typescript
export const transformOlaSecurityDetailDTO = (dto: any) => {
  // DTO를 도메인 모델로 변환
  return {
    // 변환된 데이터
  }
}
```
- **역할**: API 응답 데이터를 도메인 모델로 변환
- **장점**: API와 UI 계층의 분리, 타입 안정성

## 🏗️ 아키텍처 패턴

### 1. **도메인별 분리**
- 각 도메인(dataset, recommend, stocks)이 독립적인 폴더로 분리
- 도메인별로 고유한 쿼리 키, 옵션, 변환 함수를 가짐

### 2. **관심사 분리**
- **hooks.tsx**: 훅 인터페이스
- **keys.tsx**: 쿼리 키 관리
- **options.tsx**: 쿼리 설정
- **transforms.tsx**: 데이터 변환
- **index.tsx**: 모듈 export

### 3. **React Query 패턴**
- 쿼리 키를 중앙에서 관리
- 옵션을 함수로 분리하여 재사용성 향상
- 데이터 변환을 별도 함수로 분리

### 4. **타입 안정성**
- 모든 쿼리 키에 `as const` 적용
- TypeScript를 활용한 타입 안정성 확보

## 📝 사용 예시

```typescript
// 컴포넌트에서 사용
import { useGetStockListQuery } from '@/hooks/data-fetching/stocks'

function StockList() {
  const { data: stocks, isLoading, error } = useGetStockListQuery()
  
  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>
  
  return (
    <div>
      {stocks?.map(stock => (
        <div key={stock.id}>{stock.name}</div>
      ))}
    </div>
  )
}
```

## 🔄 데이터 플로우

1. **컴포넌트** → `useGetStockListQuery()` 호출
2. **hooks.tsx** → `getStockListQueryOptions()` 사용
3. **options.tsx** → API 호출 및 데이터 변환
4. **transforms.tsx** → DTO를 도메인 모델로 변환
5. **컴포넌트** → 변환된 데이터 사용

## 🎯 장점

1. **모듈화**: 도메인별로 독립적인 관리
2. **재사용성**: 옵션과 변환 함수의 재사용
3. **타입 안정성**: TypeScript를 활용한 안전한 개발
4. **유지보수성**: 관심사 분리로 인한 쉬운 유지보수
5. **확장성**: 새로운 도메인 추가가 용이 