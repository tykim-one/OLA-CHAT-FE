import { memo, useMemo } from 'react'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

import { EtfContentProps } from '@/types/modern-chat'

// 주식 정보 테이블
const EtfContent = memo(function EtfContent({
  title,
  discription,
  tableData,
  className = '',
}: EtfContentProps) {
  // tableData 구조를 useMemo로 메모이제이션
  const { header = [], rows = [] } = useMemo(() => tableData || {}, [tableData])

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <div className="flex flex-col gap-3">
        <h3 className="text-tableHead font-bold text-slate-900">
          {title} 구성 종목 정보는 다음과 같습니다.
        </h3>
        <p className="text-body-medium text-slate-900">{discription}</p>
      </div>

      {/* 반응형 테이블 컨테이너 */}
      <div className="w-full border-y border-y-black">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow className="w-full">
              {header.map((headerText: string, index: number) => (
                <TableHead
                  key={index}
                  className={`text-center !text-tableHeadSmall text-slate-900 p-2 whitespace-nowrap`}
                >
                  {headerText}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-[14px]">
            {rows.map((row: any, rowIndex: number) => (
              <TableRow
                key={rowIndex}
                className="border-b tableItemSmall border-slate-200 hover:bg-slate-50"
              >
                {row.map((cell: string, cellIndex: number) => (
                  <TableCell
                    key={cellIndex}
                    className={`text-slate-700 p-2 align-middle ${
                      cellIndex === 0 ? 'text-left' : 'text-center'
                    }`}
                  >
                    <div className="break-words whitespace-normal">{cell}</div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
})

export default EtfContent
