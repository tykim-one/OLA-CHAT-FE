// 날짜 관련 유틸리티 함수들

/**
 * 오늘 날짜를 한국어 형식으로 포맷팅
 * @returns 예: "2024년 1월 15일"
 */
export const getTodayKoreanFormat = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // 0부터 시작하므로 +1
  const date = today.getDate()

  return `${year}년 ${month}월 ${date}일`
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param date 포맷팅할 날짜 (기본값: 오늘)
 * @returns 예: "2024-01-15"
 */
export const formatDateToISO = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]
}
