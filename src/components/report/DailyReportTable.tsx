import { getTypographyClassNameForHeaderCellWeb } from '@/utils/typography'

import type {
  TableCellValue,
  TableChangeMetricCellValue,
  TableColoredCellValue,
  TableRow,
  TableTextCellValue,
} from '@/types/dailyReport'

interface DailyReportTableProps {
  headers: string[]
  rows: TableRow[]
  theme?: string
}

const baseCellClassName = 'font-medium text-center'

const formatNumberWithCommas = (rawValue: string) => {
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

const getChangeColorClassName = (cellValue: string) => {
  const trimmedValue = cellValue.trim()

  if (trimmedValue.startsWith('+') || /^([▲↑])/.test(trimmedValue)) {
    return 'text-red-500'
  }

  if (trimmedValue.startsWith('-') || /^([▼↓])/.test(trimmedValue)) {
    return 'text-[#3B82F6]'
  }

  return 'text-slate-700'
}

// 셀 값의 타입을 확인하고 적절하게 렌더링하는 함수
const isTextCellValue = (value: TableCellValue): value is TableTextCellValue => {
  return typeof value === 'string'
}

const isColoredCellValue = (value: TableCellValue): value is TableColoredCellValue => {
  if (typeof value === 'string') {
    return false
  }

  return 'color' in value && 'value' in value
}

const isChangeMetricCellValue = (value: TableCellValue): value is TableChangeMetricCellValue => {
  if (typeof value === 'string') {
    return false
  }

  return 'diff' in value && 'changeValue' in value && 'unit' in value
}

const renderCellValue = (value: TableCellValue, header: string) => {
  const isPriceColumn = header === '현재가(KRW)' || header === '매매기준율'
  const isChangeColumn =
    header === '전일대비' ||
    header === '전일 대비' ||
    header === '전일 대비(%)' ||
    header === '전일 대비(%, 원)'

  if (isTextCellValue(value)) {
    const displayValue = isPriceColumn ? formatNumberWithCommas(value) : value
    const dynamicTypographyClassName = getTypographyClassNameForHeaderCellWeb({
      header,
      value: displayValue,
    })

    const className = isChangeColumn
      ? `${baseCellClassName} ${dynamicTypographyClassName ?? 'text-base leading-normal'} ${getChangeColorClassName(value)}`
      : `${baseCellClassName} ${dynamicTypographyClassName ?? 'text-base leading-normal'} text-slate-700`

    return <div className={className}>{displayValue}</div>
  }

  if (isColoredCellValue(value)) {
    return (
      <div
        className={`${baseCellClassName} text-base leading-normal`}
        style={{ color: value.color }}
      >
        {isPriceColumn ? formatNumberWithCommas(value.value) : value.value}
      </div>
    )
  }

  if (isChangeMetricCellValue(value)) {
    const percentageClassName = `${getChangeColorClassName(value.diff)}`

    if (value.changeValue !== '-' && value.unit) {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className={`text-base font-medium ${percentageClassName}`}>{value.diff}</span>
          <span
            className={`text-xs font-medium ${percentageClassName}`}
          >{`<${value.changeValue} ${value.unit}>`}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center gap-1">
        <span className={`text-base font-medium ${percentageClassName}`}>{value.diff}</span>
      </div>
    )
  }

  return <div className={`${baseCellClassName} text-base leading-normal text-slate-700`}>-</div>
}

export const DailyReportTable = ({ headers, rows, theme }: DailyReportTableProps) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        {/* 헤더 행 */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F1F5F9]">
          {headers.map((header, index) => (
            <div key={index} className="flex-1 py-2 bg-slate-100">
              {theme === 'FOREX' && header === '전일 대비' ? (
                <div className="flex items-center justify-center">
                  <div className="text-base leading-normal font-bold text-center">{header}</div>
                  <div className="text-xs text-neutral-700 text-center">(%, 원)</div>
                </div>
              ) : (
                <div className="text-base leading-normal font-bold text-center">{header}</div>
              )}
            </div>
          ))}
        </div>

        {/* 데이터 행들 */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex border-b border-slate-200 last:border-b-0">
            {headers.map((header, colIndex) => {
              const shouldRemovePaddingY = theme === 'FOREX'

              const cellClassName = shouldRemovePaddingY
                ? 'flex flex-1 bg-transparent items-center justify-center'
                : 'flex flex-1 py-2 bg-transparent items-center justify-center'

              return (
                <div key={colIndex} className={cellClassName}>
                  {renderCellValue(row[header], header)}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
