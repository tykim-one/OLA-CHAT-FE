import * as CryptoJS from 'crypto-js'

export const simpleEncrypt = <T = any>(data: T): string => {
  const jsonStr = JSON.stringify(data)
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonStr))
}

export const simpleDecrypt = <T = any>(encryptedData: string): T => {
  try {
    const jsonStr = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedData))
    return JSON.parse(jsonStr)
  } catch (error) {
    return null as any
  }
}

export const hashStr = async (str: string): Promise<string> => {
  // TextEncoder를 사용하여 문자열을 UTF-8 바이트 배열로 변환
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  // SubtleCrypto API를 사용하여 SHA-256 해시 생성
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // ArrayBuffer를 16진수 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}
