export const truncateDecimalValues = (
  obj: Record<string, any>,
  truncatedDecimalLength: number = 4,
) => {
  const result: Record<string, any> = {}

  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'number' && !Number.isInteger(value)) {
      // Truncate to 4 decimal places (not rounding)
      const strValue = value.toString()
      const decimalIndex = strValue.indexOf('.')

      if (decimalIndex !== -1) {
        const integerPart = strValue.substring(0, decimalIndex)
        const decimalPart = strValue.substring(decimalIndex + 1)
        const truncatedDecimal =
          decimalPart.length > truncatedDecimalLength
            ? decimalPart.substring(0, truncatedDecimalLength)
            : decimalPart
        result[key] = parseFloat(`${integerPart}.${truncatedDecimal}`)
      } else {
        result[key] = value
      }
    } else {
      result[key] = value
    }
  }

  return result
}
