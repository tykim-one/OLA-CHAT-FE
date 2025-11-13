// PdfDailyReportDocument.tsx
import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import { parseAnalysisMarkdown } from '@/utils/analysisMarkdown'
import { decodeHtmlEntities } from '@/utils/htmlDecoder'
import { getTypographyPxSizeForHeaderCellPdf } from '@/utils/typography'

import type { DailyReportData, TableCellValue } from '@/types/dailyReport'

import {
  chunkArray,
  convertLineHeightToPercent,
  formatNumberWithCommas,
  getColorForNumericValue,
  getNumericValueFromDisplay,
  hasExplicitSign,
  pxToPt,
  registerPdfFonts,
} from './shared/pdfUtils'

registerPdfFonts()

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    maxWidth: pxToPt(719),
    width: '100%',
    height: '100%',
  },
  border: {
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderWidth: pxToPt(1),
    maxWidth: pxToPt(721),
    maxHeight: pxToPt(1024),
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    paddingTop: pxToPt(24),
    paddingBottom: pxToPt(44),
    paddingHorizontal: pxToPt(38),
  },
  headerWrapper: {
    position: 'relative',
    width: '100%',
    height: pxToPt(84),
    marginBottom: pxToPt(24),
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToPt(24),
  },
  headerBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  //   headerImage: {
  //     width: pxToPt(46),
  //     height: pxToPt(46),
  //     marginRight: pxToPt(8),
  //   },
  headerBorderImage: {
    maxWidth: '100%',
    width: '100%',
    height: pxToPt(1),
  },
  howsImage: {
    width: pxToPt(60),
    height: pxToPt(60),
    marginLeft: pxToPt(8),
    marginRight: pxToPt(12),
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToPt(12),
  },
  header: {
    fontFamily: 'PretendardJP-Bold',
    fontSize: pxToPt(30),
    fontWeight: 700,
    color: '#ffffff',
  },
  separator: {
    height: pxToPt(1),
    backgroundColor: '#e2e8f0',
    marginBottom: pxToPt(12),
    marginTop: pxToPt(12),
  },
  gradientLine: {
    height: pxToPt(4),
    backgroundColor: '#60a5fa',
    marginBottom: pxToPt(12),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: pxToPt(36),
    paddingBottom: pxToPt(32),
  },
  sectionTitle: {
    fontFamily: 'PretendardJP-Bold',
    fontSize: pxToPt(24),
    fontWeight: 700,
    color: '#075985',
    marginBottom: pxToPt(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBar: {
    width: pxToPt(6),
    height: pxToPt(36),
    backgroundColor: '#0ea5e9',
    marginRight: pxToPt(8),
  },
  newsList: {
    gap: pxToPt(4),
    height: pxToPt(198),
  },
  newsItem: {
    flexDirection: 'row',
    width: '100%',
    fontFamily: 'PretendardJP-Regular',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(20),
    color: '#94A3B8',
    marginVertical: 'auto',
  },
  bulletPoint: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(20),
    fontWeight: 500,
    color: '#334155',
    marginRight: pxToPt(8),
    marginTop: pxToPt(2),
  },
  newsTitle: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(20),
    fontWeight: 500,
    color: '#334155',
    lineHeight: convertLineHeightToPercent(pxToPt(20), pxToPt(28)),
  },
  newsSourceWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: pxToPt(8),
    paddingHorizontal: pxToPt(6),
    paddingVertical: pxToPt(2),
    height: pxToPt(28),
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minWidth: pxToPt(60),
    marginHorizontal: pxToPt(4),
  },

  newsSourceText: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(14),
    fontWeight: 500,
    color: '#4B5563',
  },

  newsLink: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(16),
    fontWeight: 500,
    color: '#0ea5e9',
    textDecoration: 'underline',
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: pxToPt(4),
  },
  chartImage: {
    width: pxToPt(317),
    maxHeight: pxToPt(138),
  },
  graphRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pxToPt(16),
  },
  graphImageContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  graphImageSpacing: {
    marginRight: pxToPt(12),
  },
  aiChartImage: {
    maxWidth: '100%',
    maxHeight: pxToPt(161),
    objectFit: 'contain',
    paddingHorizontal: pxToPt(48),
  },
  analysisText: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(20),
    fontWeight: 500,
    color: '#334155',
    maxHeight: '100%',
    lineHeight: convertLineHeightToPercent(pxToPt(20), pxToPt(28)),
  },
  tableContainer: {
    width: '100%',
  },
  tableRowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pxToPt(12),
  },
  tableWrapper: {
    backgroundColor: 'white',
    marginBottom: pxToPt(12),
    minWidth: pxToPt(315),
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #F1F5F9',
    backgroundColor: '#f1f5f9',
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: pxToPt(8),
    paddingHorizontal: pxToPt(6),
    fontFamily: 'PretendardJP-Bold',
    fontSize: pxToPt(16),
    fontWeight: 700,
    color: '#374151',
    textAlign: 'center',
    width: pxToPt(107),
    height: pxToPt(40),
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #e2e8f0',
  },
  tableCell: {
    // flex: 1,
    paddingVertical: pxToPt(8),
    paddingHorizontal: pxToPt(4),
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(16),
    fontWeight: 500,
    width: pxToPt(107),
    minHeight: pxToPt(40),
    alignItems: 'center',
    color: '#374151',
    textAlign: 'center',
  },
  graphTitle: {
    fontFamily: 'PretendardJP-Regular',
    fontSize: pxToPt(16),
    fontWeight: 700,
    color: '#334155',
    marginBottom: pxToPt(12),
    textAlign: 'left',
  },
  pageNum: {
    position: 'absolute',
    bottom: pxToPt(20),
    right: pxToPt(38),
    fontSize: pxToPt(10),
    color: '#334155',
  },
  sectionBlock: {
    marginBottom: pxToPt(16),
  },
  badgeWrapper: {
    position: 'absolute',
    top: pxToPt(25), // or use pxToPt(6) if needed
    right: pxToPt(20),
    width: pxToPt(74),
    height: pxToPt(36),
    paddingHorizontal: pxToPt(12), // px-3 = 12px
    paddingVertical: pxToPt(8), // py-2 = 8px
    backgroundColor: '#ef4444', // Tailwind red-500
    borderRadius: pxToPt(4), // rounded
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // shadow는 react-pdf에선 지원되지 않음
  },
  badgeText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(12), // text-sm
    fontWeight: 500, // font-medium
    color: '#ffffff',
    textAlign: 'center',
  },
})

const getThemeConfig = (theme: string) => {
  switch (theme) {
    case 'FOREX':
      return {
        newsTitle: '환율 관련 데일리 주요 뉴스',
        tableTitle: '주요 통화 현황',
        analysisTitle: '전망과 분석',
        highlightWord: '환율',
      }
    case 'AI':
      return {
        newsTitle: 'AI 테마 관련 데일리 주요 뉴스',
        tableTitle: 'AI 관련 주요 종목',
        analysisTitle: '전망과 분석',
        highlightWord: 'AI 테마',
      }
    case 'DIVIDEND':
      return {
        newsTitle: '배당 상품 관련 데일리 주요 뉴스',
        tableTitle: '고배당 종목/ETF 현황',
        analysisTitle: '전망과 분석',
        highlightWord: '배당',
      }
    default:
      return {
        newsTitle: '주요 뉴스',
        tableTitle: '주요 데이터',
        analysisTitle: '전망과 분석',
      }
  }
}

const getTableRowChunks = <T,>(rows: T[]): T[][] => {
  const totalRowCount = rows.length

  if (totalRowCount <= 4) {
    return [rows]
  }

  if (totalRowCount >= 7) {
    return chunkArray(rows.slice(0, 8), 4)
  }

  return chunkArray(rows.slice(0, 6), 3)
}

const formatAnalysis = (analysis: string) => {
  if (!analysis) {
    return ['데이터를 불러올 수 없습니다.']
  }

  // 먼저 \n으로 분리한 후, 각 줄에서 - 기준으로 다시 분리
  const lines = analysis.split('\n').filter((line) => line.trim().length > 0)
  const result: string[] = []

  lines.forEach((line) => {
    if (line.includes('-')) {
      // - 기준으로 분리하고 각 항목을 정리
      const items = line.split('-').filter((item) => item.trim().length > 0)
      items.forEach((item) => {
        result.push(`- ${item.trim()}`)
      })
    } else {
      result.push(line)
    }
  })

  return result
}

/**
 * 텍스트를 최대 길이로 자르고 말줄임표를 추가합니다.
 * @param text - 자를 텍스트
 * @param maxLength - 최대 문자 수
 * @returns 잘린 텍스트 (필요시 '...' 포함)
 */
const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return ''
  }

  // 텍스트 길이가 maxLength 이하면 그대로 반환
  if (text.length <= maxLength) {
    return text
  }

  // maxLength까지 자르고 '...' 추가
  return `${text.slice(0, maxLength)}...`
}

type PdfDailyReportDocumentProps = {
  report: DailyReportData
}

export const PdfDailyReportDocument = ({ report }: PdfDailyReportDocumentProps) => {
  const themeConfig = getThemeConfig(report.theme)
  const analysisBlocks = parseAnalysisMarkdown(report.analysisData)
  const tableRowChunks = getTableRowChunks(report.tableData?.rows ?? [])
  const tableRowChunkPairs = chunkArray(tableRowChunks, 2)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerWrapper} fixed>
          <Image src={`/daily/${report.theme.toLowerCase()}.png`} style={styles.headerBgImage} />

          <View style={styles.headerContainer}>
            <View style={styles.leftGroup}>
              <Image src="/hows.png" style={styles.howsImage} />
              <View>
                <Text style={styles.header}>
                  IBK 자산관리 How's:{' '}
                  {themeConfig.highlightWord && report.title.includes(themeConfig.highlightWord) ? (
                    <>
                      {report.title.split(themeConfig.highlightWord).map((part, index) => (
                        <Text key={index}>
                          {part}
                          {index < report.title.split(themeConfig.highlightWord).length - 1 && (
                            <Text style={{ color: '#FFD900' }}>{themeConfig.highlightWord}</Text>
                          )}
                        </Text>
                      ))}
                    </>
                  ) : (
                    report.title
                  )}
                </Text>
                <Text
                  style={{
                    fontFamily: 'PretendardJP-Regular',
                    fontSize: pxToPt(14),
                    color: '#ffffff',
                    marginTop: pxToPt(2),
                  }}
                >
                  자산관리사업부 작성일: {report.date}
                </Text>
              </View>
            </View>
            <View style={styles.badgeWrapper}>
              <Text style={styles.badgeText}>행 내 한</Text>
            </View>
          </View>
          <Image src="/header-b-border.png" style={styles.headerBorderImage} />
        </View>

        {/* <View style={styles.border}> */}
        {/* 구분선 */}
        {/* <View style={styles.gradientLine} /> */}

        {/* 컨텐츠 영역 */}
        <View style={styles.contentWrapper}>
          {/* 뉴스 섹션 */}
          <View style={styles.sectionBlock} wrap={false}>
            <View style={styles.sectionTitle}>
              <View style={styles.titleBar} />
              <Text>{themeConfig.newsTitle}</Text>
            </View>

            <View style={styles.newsList}>
              {report.newsData && report.newsData.length > 0 ? (
                report.newsData.slice(0, 6).map((news, index) => (
                  <View key={index} style={styles.newsItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.newsTitle}>
                      {/* {decodeHtmlEntities(news.title)} */}
                      {truncateText(decodeHtmlEntities(news.title), 35)}
                    </Text>

                    {/* <View style={styles.newsSourceWrapper}>
                          <Text style={styles.newsSourceText}>{news.source}</Text>
                        </View> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginHorizontal: pxToPt(4),
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#f3f4f6',
                          paddingHorizontal: pxToPt(6),
                          paddingVertical: pxToPt(2),
                          // height: pxToPt(28),
                          maxHeight: pxToPt(28),
                          borderRadius: pxToPt(8),
                          // alignSelf: 'flex-start',
                          minWidth: pxToPt(60),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'PretendardJP-Regular',
                            fontSize: pxToPt(14),
                            fontWeight: 500,
                            color: '#4B5563',
                            marginTop: pxToPt(4),
                          }}
                        >
                          {news.source}
                        </Text>
                      </View>
                    </View>
                    {news.link ? (
                      <Link href={news.link} style={styles.newsLink}>
                        링크
                      </Link>
                    ) : null}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>발행된 뉴스가 없습니다.</Text>
              )}
            </View>
          </View>
          {/* 차트 이미지 섹션 */}
          {/* 분석 섹션 */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitle}>
              <View style={styles.titleBar} />
              <Text>{themeConfig.analysisTitle}</Text>
            </View>

            <View style={{ gap: pxToPt(4), minHeight: pxToPt(112) }}>
              {/* report.newsData && report.newsData.length > 0 */}
              {report.newsData.length === 0 ? (
                <Text style={[styles.emptyText]}>
                  발행된 뉴스가 없기에 전망과 분석을 제공하기 어렵습니다.
                </Text>
              ) : (
                analysisBlocks.map((block, blockIndex) => {
                  if (block.type === 'paragraph') {
                    return (
                      <Text
                        key={`analysis-paragraph-${blockIndex}`}
                        style={[styles.analysisText, { marginBottom: pxToPt(8) }]}
                      >
                        {block.segments.map((segment, segmentIndex) => (
                          <Text
                            key={`analysis-paragraph-${blockIndex}-segment-${segmentIndex}`}
                            style={
                              segment.isBold
                                ? {
                                    fontFamily: 'PretendardJP-Bold',
                                    fontWeight: 700,
                                  }
                                : undefined
                            }
                          >
                            {segment.text}
                          </Text>
                        ))}
                      </Text>
                    )
                  }

                  return (
                    <View
                      key={`analysis-list-${blockIndex}`}
                      style={{ marginBottom: pxToPt(8), gap: pxToPt(6) }}
                    >
                      {block.items.map((itemSegments, itemIndex) => (
                        <Text
                          key={`analysis-list-item-${blockIndex}-${itemIndex}`}
                          style={styles.analysisText}
                        >
                          •{' '}
                          {itemSegments.map((segment, segmentIndex) => (
                            <Text
                              key={`analysis-list-item-${blockIndex}-${itemIndex}-segment-${segmentIndex}`}
                              style={
                                segment.isBold
                                  ? {
                                      fontFamily: 'PretendardJP-Bold',
                                      fontWeight: 700,
                                    }
                                  : undefined
                              }
                            >
                              {segment.text}
                            </Text>
                          ))}
                        </Text>
                      ))}
                    </View>
                  )
                })
              )}
            </View>
          </View>

          {/* 테이블 섹션 */}
          <View style={styles.sectionBlock} wrap={false}>
            <View style={styles.sectionTitle}>
              <View style={styles.titleBar} />
              <Text>{themeConfig.tableTitle}</Text>
            </View>

            <View style={styles.tableContainer}>
              {report.tableData &&
              report.tableData.headers &&
              report.tableData.headers.length > 0 ? (
                <>
                  {tableRowChunkPairs.map((rowsChunkPair, pairIndex) => (
                    <View
                      key={`table-row-group-${pairIndex}`}
                      style={styles.tableRowGroup}
                      wrap={false}
                      break={pairIndex > 0}
                    >
                      {rowsChunkPair.map((rowsChunk, chunkIndex) => {
                        const tableIndex = pairIndex * 2 + chunkIndex
                        const shouldAddSpacing = rowsChunkPair.length > 1 && chunkIndex === 0

                        // 테이블이 두 개로 나뉠 때만 minWidth 적용, 하나일 때는 full width
                        const tableWrapperStyle =
                          rowsChunkPair.length > 1
                            ? styles.tableWrapper
                            : { ...styles.tableWrapper, width: '100%', minWidth: 'auto' }

                        return (
                          <View key={`table-${tableIndex}`} style={tableWrapperStyle}>
                            {/* 테이블 헤더 */}
                            <View style={styles.tableHeader}>
                              {report.tableData.headers.map((header, index) => {
                                // 테이블이 두 개로 나뉠 때만 고정 너비, 하나일 때는 flex 사용
                                const headerCellStyle =
                                  rowsChunkPair.length > 1
                                    ? styles.tableHeaderCell
                                    : { ...styles.tableHeaderCell, flex: 1, width: 'auto' }

                                return (
                                  <Text key={`${header}-${index}`} style={headerCellStyle}>
                                    {header}
                                    {report.theme === 'FOREX' && header === '전일 대비' && (
                                      <Text style={{ fontSize: pxToPt(12), color: '#6B7280' }}>
                                        (%, 원)
                                      </Text>
                                    )}
                                  </Text>
                                )
                              })}
                            </View>

                            {/* 테이블 데이터 */}
                            {rowsChunk && rowsChunk.length > 0 ? (
                              rowsChunk.map((row, rowIndex) => (
                                <View key={`${tableIndex}-${rowIndex}`} style={styles.tableRow}>
                                  {report.tableData.headers.map((header, colIndex) => {
                                    const cellValue = row[header] as TableCellValue | undefined

                                    let displayValue = '-'
                                    let explicitColor: string | undefined
                                    let multiLineContent: {
                                      primary: string
                                      secondary: string
                                    } | null = null

                                    if (
                                      typeof cellValue === 'string' ||
                                      typeof cellValue === 'number'
                                    ) {
                                      if (header === '현재가(KRW)' || header === '매매기준율') {
                                        displayValue = formatNumberWithCommas(String(cellValue))
                                      } else {
                                        displayValue = String(cellValue)
                                      }
                                    } else if (
                                      cellValue &&
                                      'value' in cellValue &&
                                      'color' in cellValue
                                    ) {
                                      displayValue =
                                        header === '현재가(KRW)'
                                          ? formatNumberWithCommas(String(cellValue.value))
                                          : String(cellValue.value)
                                      explicitColor = cellValue.color
                                    } else if (
                                      cellValue &&
                                      'diff' in cellValue &&
                                      'changeValue' in cellValue &&
                                      'unit' in cellValue
                                    ) {
                                      const diffRaw = cellValue.diff ?? ''
                                      const diffText = String(diffRaw).trim()
                                      const hasDiffText = diffText !== '' && diffText !== '-'

                                      const changeValueRaw = cellValue.changeValue
                                      const changeValueText =
                                        changeValueRaw === undefined || changeValueRaw === null
                                          ? ''
                                          : String(changeValueRaw).trim()

                                      const unitRaw = cellValue.unit
                                      const unitText =
                                        unitRaw === undefined || unitRaw === null
                                          ? ''
                                          : String(unitRaw).trim()

                                      const hasSecondaryLine =
                                        changeValueText !== '' &&
                                        changeValueText !== '-' &&
                                        unitText !== ''

                                      if (hasSecondaryLine) {
                                        multiLineContent = {
                                          primary: hasDiffText ? diffText : '-',
                                          secondary: `${changeValueText} ${unitText}`.trim(),
                                        }

                                        displayValue = `${multiLineContent.primary}\n${multiLineContent.secondary}`
                                      } else if (hasDiffText) {
                                        multiLineContent = null
                                        displayValue = diffText
                                      } else {
                                        multiLineContent = null
                                        displayValue = '-'
                                      }

                                      const diffNumericValue = hasDiffText
                                        ? getNumericValueFromDisplay(diffText)
                                        : null
                                      const diffColor = getColorForNumericValue(diffNumericValue)

                                      if (diffColor) {
                                        explicitColor = diffColor
                                      }
                                    }

                                    const shouldParseNumericValue =
                                      explicitColor === undefined && hasExplicitSign(displayValue)

                                    const numericValue = shouldParseNumericValue
                                      ? getNumericValueFromDisplay(displayValue)
                                      : null

                                    const conditionalColor =
                                      explicitColor ?? getColorForNumericValue(numericValue)

                                    // 테이블이 두 개로 나뉠 때만 고정 너비, 하나일 때는 flex 사용
                                    const baseCellStyle =
                                      rowsChunkPair.length > 1
                                        ? styles.tableCell
                                        : {
                                            ...styles.tableCell,
                                            flex: 1,
                                            width: 'auto',
                                          }

                                    const typographySizes = getTypographyPxSizeForHeaderCellPdf({
                                      header,
                                      value: multiLineContent
                                        ? multiLineContent.primary
                                        : displayValue,
                                    })

                                    const cellStyle = [
                                      baseCellStyle,
                                      conditionalColor
                                        ? {
                                            color: conditionalColor,
                                          }
                                        : {},
                                      typographySizes
                                        ? {
                                            fontSize: pxToPt(typographySizes.fontSize),
                                            lineHeight: `${typographySizes.LINE_HEIGHT_MULTIPLIER * 100}%`,
                                          }
                                        : {},
                                    ]

                                    return (
                                      <Text
                                        key={`${tableIndex}-${rowIndex}-${colIndex}`}
                                        style={cellStyle}
                                        wrap={true}
                                      >
                                        {multiLineContent ? (
                                          <>
                                            {multiLineContent.primary}
                                            {'\n'}
                                            <Text
                                              style={{
                                                fontSize: pxToPt(12),
                                                lineHeight: convertLineHeightToPercent(
                                                  pxToPt(12),
                                                  pxToPt(16),
                                                ),
                                              }}
                                            >
                                              {`<${multiLineContent.secondary}>`}
                                            </Text>
                                          </>
                                        ) : (
                                          displayValue
                                        )}
                                      </Text>
                                    )
                                  })}
                                </View>
                              ))
                            ) : (
                              <View style={styles.tableRow}>
                                <Text
                                  style={[
                                    styles.tableCell,
                                    { flex: report.tableData.headers.length },
                                  ]}
                                >
                                  테이블 데이터가 없습니다.
                                </Text>
                              </View>
                            )}
                          </View>
                        )
                      })}
                    </View>
                  ))}
                </>
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>테이블 데이터가 없습니다.</Text>
                </View>
              )}
            </View>
          </View>

          {/* 차트 이미지 섹션 (테이블 이후) */}
          {report.graphData.length > 0 && (
            <View style={styles.graphRow}>
              {report.graphData.map((graphItem, index) => {
                const { url: graphUrl, title: graphTitle, date: graphDate } = graphItem
                const fallbackTitle = '7일간 가격변동'
                const displayTitle = graphTitle || fallbackTitle

                return (
                  <View
                    key={`${graphUrl}-${index}`}
                    style={
                      index === 0
                        ? [styles.graphImageContainer, styles.graphImageSpacing]
                        : styles.graphImageContainer
                    }
                    wrap={false}
                  >
                    <Text style={styles.graphTitle}>
                      <Text
                        style={{
                          fontFamily: 'PretendardJP-Bold',
                          fontWeight: 700,
                          marginRight: pxToPt(8),
                        }}
                      >
                        {displayTitle}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'PretendardJP-Regular',
                          fontWeight: 500,
                          marginLeft: pxToPt(8),
                        }}
                      >
                        {' '}
                        {report.theme === 'FOREX' ? '1달간' : '7일간'} 가격변동
                      </Text>
                    </Text>
                    <Image src={graphUrl} style={styles.chartImage} />
                  </View>
                )
              })}
            </View>
          )}

          {/* 페이지 번호 */}
          <Text
            style={styles.pageNum}
            render={({ pageNumber }) => String(pageNumber).padStart(2, '0')}
            fixed
          />
        </View>
        {/* </View> */}
      </Page>
    </Document>
  )
}
