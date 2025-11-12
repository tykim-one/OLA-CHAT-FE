import { useEffect, useRef } from 'react'

/**
 * A hook that provides automatic focus functionality for input elements.
 * @param shouldFocus - Optional boolean to control whether the input should be focused (defaults to true)
 * @param delay - Optional delay in milliseconds before focusing (defaults to 0)
 * @returns A ref object to be attached to the input element
 */
export const useInputAutoFocus = <T extends HTMLElement = HTMLInputElement>({
  ref,
  shouldFocus = true,
  delay = 0,
}: {
  ref?: T
  shouldFocus?: boolean
  delay?: number
} = {}) => {
  const inputRef = useRef<T | null>(null)

  useEffect(() => {
    if (ref) {
      inputRef.current = ref
    }

    if (!shouldFocus || !inputRef.current) return

    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, delay)

    return () => {
      clearTimeout(focusTimer)
    }
  }, [shouldFocus, delay])

  return inputRef
}

export default useInputAutoFocus
