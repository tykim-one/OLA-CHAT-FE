/**
 * 폼 제출 시 공통 처리 로직
 */
export const handleFormSubmit = (
  e: React.FormEvent,
  callback: () => void,
  preventDefaultBehavior = true,
) => {
  if (preventDefaultBehavior) {
    e.preventDefault()
  }
  callback()
}

/**
 * 폼 데이터 초기화 헬퍼
 */
export const initializeFormData = <T>(initialData: T | undefined, defaultData: T): T => {
  return initialData || defaultData
}

/**
 * 폼 필드 변경 헬퍼
 */
export const createFieldHandler = <T>(setFormData: React.Dispatch<React.SetStateAction<T>>) => {
  return <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
}

/**
 * 선택 항목 토글 헬퍼
 */
export const toggleArrayItem = <T>(array: T[], item: T): T[] => {
  const index = array.indexOf(item)
  if (index === -1) {
    return [...array, item]
  } else {
    return array.filter((_, i) => i !== index)
  }
}

/**
 * 알림 메시지 표시 헬퍼
 */
export const showValidationMessage = (message: string, type: 'error' | 'info' = 'error') => {
  const prefix = type === 'error' ? '❌' : '📋'
  alert(`${prefix} ${message}`)
}
