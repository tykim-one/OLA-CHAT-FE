export type StockTypographyTargetHeader = '종목' | '통화' | '종목/ETF'

const stockHeaderSet = new Set<StockTypographyTargetHeader>(['종목', '통화', '종목/ETF'])

const getTrimmedLength = (value: string) => {
  if (!value) {
    return 0
  }

  return value.trim().length
}

const getWebTypographyClassName = (length: number) => {
  if (length === 0) {
    return 'text-xs leading-4'
  }

  if (length <= 6) {
    return 'text-base leading-6'
  }

  if (length === 7) {
    return 'text-sm leading-5'
  }

  if (length <= 9) {
    return 'text-xs leading-4'
  }

  if (length <= 18) {
    return 'text-[12px] leading-[12px] whitespace-break-spaces'
  }

  return 'text-[12px] leading-[12px] whitespace-break-spaces'
}

const getPdfTypographyPxSize = (length: number) => {
  if (length === 0) {
    return {
      fontSize: 12,
      lineHeight: 16,
      LINE_HEIGHT_MULTIPLIER: 16 / 12, // 1.333...
    }
  }

  if (length <= 6) {
    return {
      fontSize: 16,
      lineHeight: 24,
      LINE_HEIGHT_MULTIPLIER: 24 / 16, // 1.5
    }
  }

  if (length === 7) {
    return {
      fontSize: 14,
      lineHeight: 20,
      LINE_HEIGHT_MULTIPLIER: 20 / 14, // 1.428...
    }
  }

  if (length <= 9) {
    return {
      fontSize: 12,
      lineHeight: 16,
      LINE_HEIGHT_MULTIPLIER: 16 / 12, // 1.333...
    }
  }

  // 기본값
  return {
    fontSize: 12,
    lineHeight: 12,
    LINE_HEIGHT_MULTIPLIER: 12 / 12, // 1.0
  }
}

export const getTypographyClassNameForHeaderCellWeb = (params: {
  header: string
  value: string
}) => {
  const { header, value } = params

  if (!value) {
    return undefined
  }

  if (!stockHeaderSet.has(header as StockTypographyTargetHeader)) {
    return undefined
  }

  const textLength = getTrimmedLength(value)

  return getWebTypographyClassName(textLength)
}

export const getTypographyPxSizeForHeaderCellPdf = (params: { header: string; value: string }) => {
  const { header, value } = params

  if (!value) {
    return null
  }

  if (!stockHeaderSet.has(header as StockTypographyTargetHeader)) {
    return null
  }

  const textLength = getTrimmedLength(value)

  return getPdfTypographyPxSize(textLength)
}

/**
 * PDF용 lineHeight를 %로 변환하는 함수
 * @param fontSize - 폰트 크기 (px)
 * @param lineHeight - 라인 높이 (px)
 * @returns lineHeight를 %로 변환한 값 (예: "120%")
 */
export const convertLineHeightToPercent = (fontSize: number, lineHeight: number): string => {
  if (fontSize <= 0) {
    throw new Error('fontSize는 0보다 큰 값이어야 합니다.')
  }

  const percentage = (lineHeight / fontSize) * 100
  return `${Math.round(percentage)}%`
}

/**
 * PDF용 lineHeight를 %로 변환하는 함수 (소수점 포함)
 * @param fontSize - 폰트 크기 (px)
 * @param lineHeight - 라인 높이 (px)
 * @param decimalPlaces - 소수점 자릿수 (기본값: 1)
 * @returns lineHeight를 %로 변환한 값 (예: "120.5%")
 */
export const convertLineHeightToPercentPrecise = (
  fontSize: number,
  lineHeight: number,
  decimalPlaces: number = 1,
): string => {
  if (fontSize <= 0) {
    throw new Error('fontSize는 0보다 큰 값이어야 합니다.')
  }

  const percentage = (lineHeight / fontSize) * 100
  return `${percentage.toFixed(decimalPlaces)}%`
}
