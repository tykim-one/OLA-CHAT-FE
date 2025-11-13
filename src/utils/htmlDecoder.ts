import he from 'he'
/**
 * HTML 엔티티를 안전하게 디코딩합니다.
 * 이중 인코딩된 경우도 자동으로 처리합니다.
 *
 * @param text - 디코딩할 텍스트
 * @returns 디코딩된 텍스트
 *
 * @example
 * ```typescript
 * decodeHtmlEntities('&amp;quot;Hello&amp;quot;') // '"Hello"'
 * decodeHtmlEntities('&quot;Hello&quot;') // '"Hello"'
 * decodeHtmlEntities('Hello') // 'Hello'
 * ```
 */
export const decodeHtmlEntities = (text: string | null | undefined): string => {
  if (!text) return ''

  let decoded = he.decode(text)

  // 이중 인코딩된 경우를 대비해 한 번 더 디코딩
  if (decoded !== he.decode(decoded)) {
    decoded = he.decode(decoded)
  }

  return decoded
}
