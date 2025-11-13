import { Font } from '@react-pdf/renderer'

import { convertLineHeightToPercent, convertLineHeightToPercentPrecise } from '@/utils/typography'

// px 단위를 pt로 변환하는 공통 함수
export const pxToPt = (px: number): number => {
  return px * 0.75
}

// 배열을 원하는 크기로 나누는 헬퍼 함수
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) {
    return []
  }

  const result: T[][] = []

  for (let index = 0; index < array.length; index += chunkSize) {
    result.push(array.slice(index, index + chunkSize))
  }

  if (result.length === 0) {
    return [array]
  }

  return result
}

// 숫자 문자열에 천 단위 콤마를 추가하는 함수
export const formatNumberWithCommas = (rawValue: string) => {
  const sanitizedValue = rawValue.replace(/,/g, '').trim()

  // 정수 또는 소수점이 있는 숫자 패턴으로 변경
  if (!/^[-+]?\d+(\.\d+)?$/.test(sanitizedValue)) {
    return rawValue
  }

  const hasSign = sanitizedValue.startsWith('-') || sanitizedValue.startsWith('+')
  const sign = hasSign ? sanitizedValue[0] : ''
  const numericPart = hasSign ? sanitizedValue.slice(1) : sanitizedValue

  // 소수점 기준으로 정수 부분과 소수 부분 분리
  const [integerPart, decimalPart] = numericPart.split('.')
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decimalPart
    ? `${sign}${formattedIntegerPart}.${decimalPart}`
    : `${sign}${formattedIntegerPart}`
}

// 표시 문자열에 명시적인 부호가 포함되어 있는지 확인합니다.
export const hasExplicitSign = (displayValue: string): boolean => {
  if (!displayValue) {
    return false
  }

  const trimmedValue = displayValue.trim()

  if (!trimmedValue) {
    return false
  }

  return (
    trimmedValue.startsWith('+') ||
    trimmedValue.startsWith('-') ||
    trimmedValue.startsWith('−') ||
    trimmedValue.includes('▲') ||
    trimmedValue.includes('▼')
  )
}

// 숫자 문자열에서 기호와 퍼센트 등을 제거해 실제 숫자 값을 계산합니다.
export const getNumericValueFromDisplay = (displayValue: string): number | null => {
  if (!displayValue) {
    return null
  }

  const trimmedValue = displayValue.trim()

  if (!trimmedValue) {
    return null
  }

  const hasNegativeSymbol = trimmedValue.includes('-') || trimmedValue.includes('▼')
  const numericPortion = trimmedValue.replace(/[^0-9.,]/g, '').replace(/,/g, '')

  if (!numericPortion) {
    return null
  }

  const signedNumericString = `${hasNegativeSymbol ? '-' : ''}${numericPortion}`
  const parsedValue = Number(signedNumericString)

  if (Number.isNaN(parsedValue)) {
    return null
  }

  return parsedValue
}

// 숫자 값에 따라 PDF에서 사용할 텍스트 색상을 결정합니다.
export const getColorForNumericValue = (numericValue: number | null): string | undefined => {
  if (numericValue === null) {
    return undefined
  }

  if (numericValue > 0) {
    return '#EF4444'
  }

  if (numericValue < 0) {
    return '#2563EB'
  }

  return '#111827'
}

// 텍스트 길이를 제한하고 말줄임표를 추가하는 함수
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength)}...`
}

// lineHeight(px)를 퍼센트 문자열로 변환하는 헬퍼를 재노출합니다.
export { convertLineHeightToPercent, convertLineHeightToPercentPrecise }

let fontsRegistered = false

// PDF 렌더링에 사용할 폰트를 등록하는 함수 (한 번만 등록)
export const registerPdfFonts = () => {
  if (fontsRegistered) {
    return
  }

  Font.registerHyphenationCallback((word) => [word])

  Font.register({
    family: 'Pretendard-Regular',
    src: '/fonts/Pretendard-Regular.ttf',
  })

  Font.register({
    family: 'Pretendard-Bold',
    src: '/fonts/Pretendard-Bold.ttf',
  })

  Font.register({
    family: 'PretendardJP-Regular',
    src: '/fonts/PretendardJP-Regular.ttf',
  })

  Font.register({
    family: 'PretendardJP-Bold',
    src: '/fonts/PretendardJP-Bold.ttf',
  })

  Font.register({
    family: 'PretendardJP-Medium',
    src: '/fonts/PretendardJP-Medium.ttf',
  })

  Font.register({
    family: 'NotoSansKR-Regular',
    src: '/fonts/NotoSansKR-Regular.ttf',
  })

  fontsRegistered = true
}
