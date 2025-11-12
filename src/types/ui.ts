/**
 * 확장 가능한 UI 컴포넌트들을 위한 타입 정의
 */

/**
 * 공통 스타일 커스터마이징 타입
 */
export interface StyleCustomization {
  /** 컨테이너 스타일 */
  container?: string
  /** 내부 요소 스타일 */
  inner?: string
  /** 텍스트 스타일 */
  text?: string
}

/**
 * 색상 커스터마이징 타입
 */
export interface ColorCustomization {
  /** 배경 색상 */
  background?: string
  /** 호버 색상 */
  hover?: string
  /** 텍스트 색상 */
  text?: string
  /** 테두리 색상 */
  border?: string
}

/**
 * 뱃지 설정 타입
 */
export interface BadgeConfig {
  /** 뱃지 표시 여부 */
  show: boolean
  /** 뱃지 카운트 */
  count?: number
  /** 뱃지 색상 */
  color?: string
  /** 뱃지 위치 */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * 액션 버튼 설정 타입
 */
export interface ActionButtonConfig {
  /** 버튼 표시 여부 */
  show?: boolean
  /** 버튼 텍스트 */
  text?: string
  /** 버튼 아이콘 */
  icon?: React.ReactNode
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 버튼 스타일 */
  className?: string
  /** 버튼 색상 변형 */
  variant?: 'primary' | 'secondary' | 'outline'
}

/**
 * 위치 설정 타입
 */
export interface PositionConfig {
  /** 하단 여백 */
  bottom?: string
  /** 우측 여백 */
  right?: string
  /** 상단 여백 */
  top?: string
  /** 좌측 여백 */
  left?: string
}

/**
 * 플레이스홀더 설정 타입
 */
export interface PlaceholderConfig {
  /** 준비 상태 플레이스홀더 */
  ready?: string
  /** 로딩 상태 플레이스홀더 */
  loading?: string
}

/**
 * 컴포넌트 크기 타입
 */
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * 컴포넌트 변형 타입
 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error'

/**
 * 컴포넌트 모양 타입
 */
export type ComponentShape = 'circle' | 'rounded' | 'square'

/**
 * 그림자 효과 타입
 */
export type ShadowEffect = 'none' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * 애니메이션 효과 타입
 */
export type AnimationEffect = 'none' | 'pulse' | 'bounce' | 'spin' | 'ping'

/**
 * 렌더 함수 타입
 */
export type RenderFunction<T> = (data: T) => React.ReactNode
