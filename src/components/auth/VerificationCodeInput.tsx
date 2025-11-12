'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

/**
 * VerificationCodeInput Props
 */
interface VerificationCodeInputProps {
  length?: number
  value: string
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  disabled?: boolean
}

/**
 * 6자리 인증코드 입력 컴포넌트
 * 
 * 개별 입력칸으로 구성되며, 자동으로 다음 칸으로 포커스가 이동합니다.
 * 
 * @example
 * ```tsx
 * <VerificationCodeInput
 *   value={code}
 *   onChange={setCode}
 *   onComplete={(code) => console.log('완료:', code)}
 * />
 * ```
 */
export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState(0)

  /**
   * 코드 값을 배열로 변환
   */
  const codeArray = value.padEnd(length, ' ').split('').slice(0, length)

  /**
   * 값이 완성되면 onComplete 호출
   */
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  /**
   * 특정 인덱스의 입력 변경 핸들러
   */
  const handleChange = (index: number, newValue: string) => {
    // 숫자만 허용
    const digit = newValue.replace(/\D/g, '').slice(-1)
    
    if (digit) {
      const newCodeArray = [...codeArray]
      newCodeArray[index] = digit
      const newCode = newCodeArray.join('').trim()
      onChange(newCode)
      
      // 다음 칸으로 자동 이동
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (newValue === '') {
      // 백스페이스로 삭제
      const newCodeArray = [...codeArray]
      newCodeArray[index] = ' '
      const newCode = newCodeArray.join('').trim()
      onChange(newCode)
    }
  }

  /**
   * 키 입력 핸들러
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      
      if (codeArray[index] !== ' ') {
        // 현재 칸에 값이 있으면 삭제
        const newCodeArray = [...codeArray]
        newCodeArray[index] = ' '
        const newCode = newCodeArray.join('').trim()
        onChange(newCode)
      } else if (index > 0) {
        // 현재 칸이 비어있으면 이전 칸으로 이동하고 삭제
        inputRefs.current[index - 1]?.focus()
        const newCodeArray = [...codeArray]
        newCodeArray[index - 1] = ' '
        const newCode = newCodeArray.join('').trim()
        onChange(newCode)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  /**
   * 붙여넣기 핸들러
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, length)
    
    if (digits) {
      onChange(digits)
      // 마지막 입력된 칸으로 포커스
      const lastIndex = Math.min(digits.length - 1, length - 1)
      inputRefs.current[lastIndex]?.focus()
    }
  }

  /**
   * 포커스 핸들러
   */
  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    // 입력칸 클릭 시 내용 선택
    inputRefs.current[index]?.select()
  }

  return (
    <div className="flex gap-2 justify-center">
      {codeArray.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit === ' ' ? '' : digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-bold bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-gray-900"
          aria-label={`인증코드 ${index + 1}번째 자리`}
        />
      ))}
    </div>
  )
}

