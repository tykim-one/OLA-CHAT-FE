// PdfDailySummaryDocument.tsx
import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import { createMarkdownList, parseAnalysisMarkdown } from '@/utils/analysisMarkdown'
import { decodeHtmlEntities } from '@/utils/htmlDecoder'

import type { DailySummaryData } from '@/types/dailySummary'

import { convertLineHeightToPercent, pxToPt, registerPdfFonts } from './shared/pdfUtils'

registerPdfFonts()

const styles = StyleSheet.create({
  // 페이지 기본 스타일
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingVertical: pxToPt(24),
    paddingHorizontal: pxToPt(20),
    width: pxToPt(721),
  },

  firstPage: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingVertical: pxToPt(0),
    paddingHorizontal: pxToPt(0),
  },

  container: {
    paddingVertical: pxToPt(24),
    paddingHorizontal: pxToPt(20),
  },
  // 섹션 간격
  sectionMargin: {
    // marginBottom: pxToPt(24),
  },

  // 메인 제목 헤더 (배경 이미지 컨테이너)
  titleHeader: {
    height: pxToPt(112),
    position: 'relative',
    overflow: 'hidden', // borderRadius 적용을 위해
  },

  // 배경 이미지
  titleHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: pxToPt(84),
  },

  // 헤더 콘텐츠 (배경 위에 표시)
  titleHeaderContent: {
    // paddingVertical: pxToPt(20),
    // paddingHorizontal: pxToPt(20),
    alignItems: 'center',
    height: pxToPt(84),
    justifyContent: 'center',
  },

  headerLogo: {
    width: pxToPt(95),
    height: pxToPt(20),
    marginBottom: pxToPt(6),
  },

  mainTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(24),
    color: '#43477B',
    textAlign: 'center',
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pxToPt(24),
    marginBottom: pxToPt(8),
    padding: pxToPt(6),
    borderRadius: pxToPt(10),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#e7efff',
    // background: 'linear-gradient(90deg, #F8FAFC 0%, #E7EFFF 100%)',
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    color: '#003F88',
  },
  sectionIcon: {
    width: pxToPt(32),
    height: pxToPt(32),
    marginRight: pxToPt(10),
  },

  

  // 카드 컨테이너

  keywordCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(16),
    minHeight: pxToPt(140),
    maxHeight: pxToPt(200),
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(16),
  },

  // AI 정보 카드
  aiInfoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(16),
    
    
  },

  aiInfoRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: pxToPt(6),
    height: pxToPt(100),
    justifyContent: 'center',
  },

  aiInfoText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(18),
    color: '#000000',
  },

  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToPt(4),
    paddingVertical: pxToPt(2),
    paddingHorizontal: pxToPt(8),
    borderRadius: pxToPt(12),
    marginLeft: pxToPt(8),
  },

  aiBadgePrimary: {
    backgroundColor: '#3B82F6',
  },

  aiBadgeSecondary: {
    backgroundColor: '#0EA5E9',
  },

  aiBadgeText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(16),
    color: '#FFFFFF',
  },

  // Check 아이콘 스타일
  checkIcon: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(22),
    color: '#FFFFFF',
    // lineHeight: pxToPt(22),
  },

  // 키워드 텍스트
  keywordText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(20),
    color: '#0F172A',
    flex: 1,
    lineHeight: convertLineHeightToPercent(pxToPt(20), pxToPt(28)),
  },
  keywordList: {
    flexDirection: 'column',
    gap: pxToPt(8),
  },
  keywordItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: pxToPt(8),
  },
  bulletPoint: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(20),
    color: '#0F172A',
    marginTop: pxToPt(2),
  },

  // 뉴스 컨테이너 (2컬럼)
  newsContainer: {
    flexDirection: 'row',
    marginBottom: pxToPt(24),
  },

  newsColumn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(16),
    marginRight: pxToPt(4),
  },

  newsColumnRight: {
    marginRight: 0,
    marginLeft: pxToPt(4),
  },

  newsItem: {
    marginBottom: pxToPt(8),
  },

  newsTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(18),
    color: '#0F172A',
    marginBottom: pxToPt(4),
    lineHeight: convertLineHeightToPercent(pxToPt(18), pxToPt(24)),
  },

  newsSource: {
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: convertLineHeightToPercent(pxToPt(16), pxToPt(24)),
  },

  newsSourceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(16),
    color: '#0F172A',
    marginRight: pxToPt(8),
  },

  newsLink: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(16),
    color: '#0EA5E9',
    textDecoration: 'underline',
  },

  // 차트 컨테이너
  chartContainer: {
    flexDirection: 'row',
    marginBottom: pxToPt(24),
  },

  chartCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(16),
    marginRight: pxToPt(4),
  },

  chartCardRight: {
    marginRight: 0,
    marginLeft: pxToPt(4),
  },

  chartHeader: {
    flexDirection: 'row',
    marginBottom: pxToPt(8),
  },

  chartLabel: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(20),
    color: '#94A3B8',
    marginRight: pxToPt(6),
  },

  chartName: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    color: '#0F172A',
  },

  chartDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: pxToPt(8),
  },

  chartImage: {
    height: pxToPt(160),
    width: '100%',
  },

  // 테이블 스타일
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: pxToPt(12),
    padding: pxToPt(12),
    marginBottom: pxToPt(24),
  },

  tableHeaderRow: {
    flexDirection: 'row',
  },

  tableHeaderCell: {
    flex: 1,
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(18),

    color: '#0F172A',
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    marginBottom: pxToPt(8),
  },

  tableCell: {
    flex: 1,
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    marginTop: pxToPt(16),
    color: '#0F172A',
    textAlign: 'center',
  },

  tableCellPositive: {
    color: '#EF4444',
  },

  tableCellNegative: {
    color: '#3B82F6',
  },

  tableCellNeutral: {
    color: '#64748B',
  },

  // AI 인사이트 텍스트
  aiInsightItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: pxToPt(6),
    marginBottom: pxToPt(8),
  },
  aiInsightBullet: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    color: '#0F172A',
    lineHeight: pxToPt(2),
  },
  aiInsightText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(20),
    color: '#0F172A',
    lineHeight: convertLineHeightToPercent(pxToPt(20), pxToPt(28)),
  },

  // 유의사항 헤더
  noticeHeader: {
    backgroundColor: '#FEE2E2',
    borderRadius: pxToPt(12),
    paddingVertical: pxToPt(8),
    marginBottom: pxToPt(8),
  },

  noticeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: pxToPt(8),
  },

  noticeTitleText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(24),
    color: '#EF4444',
  },

  noticeText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(20),
    color: '#334155',
    lineHeight: convertLineHeightToPercent(pxToPt(20), pxToPt(28)),
  },

  // 페이지 번호
  pageNumber: {
    position: 'absolute',
    bottom: pxToPt(20),
    right: pxToPt(38),
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(12),
    color: '#334155',
  },

  badgeWrapper: {
    position: 'absolute',
    top: pxToPt(40), // or use pxToPt(6) if needed
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
  tableSecondaryText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    color: '#64748B',
    marginLeft: pxToPt(10),
  },
})

const getGeneratedAtDisplay = (timestamp: string) => {
  if (!timestamp) {
    return '07:20 KST'
  }

  const [datePart] = timestamp.split(' ')

  if (!datePart) {
    return '07:20 KST'
  }

  return `${datePart} 07:20 KST`
}

const getChangeStyle = (trend?: boolean) => {
  if (trend === undefined) {
    return styles.tableCellNeutral
  }

  return trend ? styles.tableCellPositive : styles.tableCellNegative
}

type PdfDailySummaryDocumentProps = {
  data: DailySummaryData
}

export const PdfDailySummaryDocument = ({ data }: PdfDailySummaryDocumentProps) => {
  const keywordMarkdown = createMarkdownList(data.marketKeywords)
  const keywordBlocks = parseAnalysisMarkdown(keywordMarkdown)
  const aiInsightBlocks = parseAnalysisMarkdown(data.aiInsights)

  return (
    <Document>
      {/* 첫 번째 페이지: 헤더, AI 정보, 키워드, 뉴스 */}
      <Page size="A4" style={styles.firstPage}>
        {/* 메인 제목 헤더 */}

        <View style={styles.titleHeader}>
          {/* 배경 이미지 */}
          <Image src="/title.png" style={styles.titleHeaderBackground} />
          
          {/* 헤더 콘텐츠 */}
          <View style={styles.titleHeaderContent}>
            <Image src="/logo.png" style={styles.headerLogo} />
            <Text style={styles.mainTitle}>OLA 일간 리포트</Text>
            <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: pxToPt(12), color: '#64748B' }}>작성일: {data.aiReportInfo.generatedAt.slice(0, 10)}</Text>
          </View>
        </View>
        <View style={styles.container}>
          {/* Daily AI Report 섹션 */}
          <View style={styles.sectionHeader}>
          <View style={styles.aiInfoRow}>
              <Text style={styles.aiInfoText}>
              신뢰할 수 있는 출처를 기반으로 AI가 매일 리포트를 만들어 드립니다.
              </Text>
              <View style={{flexDirection: 'row', gap: pxToPt(10)}}>
              <View style={[styles.aiBadge, styles.aiBadgePrimary]}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.aiBadgeText}>검증된 데이터 소스 63개</Text>
              </View>
              <View style={[styles.aiBadge, styles.aiBadgeSecondary]}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.aiBadgeText}>보고서 생성 엔진 GPT 5.0</Text>
              </View>
              </View>
            </View>
          </View>

          {/* 오늘의 금융시장 키워드 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘의 금융시장 키워드</Text>
          </View>

          <View style={[styles.keywordCard, styles.sectionMargin]} fixed>
            <View style={styles.keywordList}>
              {keywordBlocks.length > 0 ? (
                keywordBlocks.map((block, blockIndex) => {
                  if (block.type === 'list') {
                    return block.items.map((itemSegments, itemIndex) => (
                      <View
                        key={`keyword-list-${blockIndex}-${itemIndex}`}
                        style={styles.keywordItem}
                      >
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.keywordText}>
                          {itemSegments.map((segment, segmentIndex) => (
                            <Text
                              key={`keyword-list-${blockIndex}-${itemIndex}-segment-${segmentIndex}`}
                              style={
                                segment.isBold
                                  ? {
                                      fontFamily: 'Pretendard-Bold',
                                      fontWeight: 700,
                                    }
                                  : undefined
                              }
                            >
                              {segment.text}
                            </Text>
                          ))}
                        </Text>
                      </View>
                    ))
                  }

                  return (
                    <View key={`keyword-paragraph-${blockIndex}`} style={styles.keywordItem}>
                      <Text style={styles.keywordText}>
                        {block.segments.map((segment, segmentIndex) => (
                          <Text
                            key={`keyword-paragraph-${blockIndex}-segment-${segmentIndex}`}
                            style={
                              segment.isBold
                                ? {
                                    fontFamily: 'Pretendard-Bold',
                                    fontWeight: 700,
                                  }
                                : undefined
                            }
                          >
                            {segment.text}
                            {segment.text}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  )
                })
              ) : (
                <Text style={styles.keywordText}>데이터를 불러올 수 없습니다.</Text>
              )}
            </View>
          </View>

          {/* 주요 뉴스 10선 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>주요 뉴스 10선</Text>
          </View>

          <View style={styles.newsContainer}>
            <View style={styles.newsColumn}>
              {data.topNews.slice(0, 5).map((news, index) => (
                <View key={news.id} style={styles.newsItem}>
                  <Text style={styles.newsTitle}>{decodeHtmlEntities(news.title)}</Text>
                  <View style={styles.newsSource}>
                    <Text style={styles.newsSourceText}>{news.source}</Text>
                    <Link href={news.link} style={styles.newsLink}>
                      링크
                    </Link>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.newsColumn, styles.newsColumnRight]}>
              {data.topNews.slice(5, 10).map((news, index) => (
                <View key={news.id} style={styles.newsItem}>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <View style={styles.newsSource}>
                    <Text style={styles.newsSourceText}>{news.source}</Text>
                    <Link href={news.link} style={styles.newsLink}>
                      링크
                    </Link>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.pageNumber}>01</Text>
      </Page>

      {/* 두 번째 페이지: 시장 추세, 글로벌 지수, 환율 */}
      <Page size="A4" style={styles.page}>
        {/* 시장 추세 그래프 */}
        

        {/* 글로벌 지수 및 주요 시장 지표 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>글로벌 지수와 핵심 시장 지표</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>지수</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>종가</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>전일 대비</Text>
          </View>
          {data.globalIndices.map((index, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{index.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{index.value}</Text>
              <Text style={[styles.tableCell, { flex: 2 }, getChangeStyle(index.isPositive)]}>
                <Text>{index.change}</Text>
                {index.changeValue ? (
                  <Text
                    style={[styles.tableSecondaryText, getChangeStyle(index.changeValueIsPositive)]}
                  >
                    {index.changeValue}
                  </Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>

        {/* 환율 및 채권 수익률 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>주요 통화 환율 흐름</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>지수</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>종가(원)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>전일 대비</Text>
          </View>
          {data.exchangeRates.map((rate, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{rate.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{rate.value}</Text>
              <View
                style={[
                  styles.tableCell,
                  { flex: 2 },
                  getChangeStyle(rate.isPositive),
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Text>{rate.change}</Text>
                </View>
                {rate.changeValue ? (
                  <View
                    style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Text
                      style={[
                        styles.tableSecondaryText,
                        getChangeStyle(rate.changeValueIsPositive),
                      ]}
                    >
                      {rate.changeValue}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

{/* 원자재 가격 */}
<View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>주요 원자재 시세</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>지수</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>종가(USD)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>전일 대비</Text>
          </View>
          {data.commodityPrices.map((commodity, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{commodity.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{commodity.value}</Text>
              <View
                style={[
                  styles.tableCell,
                  { flex: 2 },
                  getChangeStyle(commodity.isPositive),
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>{commodity.change}</Text>
                </View>
                {commodity.changeValue ? (
                  <View
                    style={{
                      flex: 1,
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={[
                        styles.tableSecondaryText,
                        getChangeStyle(commodity.changeValueIsPositive),
                        { fontSize: pxToPt(20) },
                      ]}
                    >
                      {commodity.changeValue}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber}>02</Text>
      </Page>

      {/* 세 번째 페이지: 원자재, AI 인사이트, 유의사항 */}
      <Page size="A4" style={styles.page}>
        

        {/* 주요 요약 및 AI 인사이트 */}
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>주요 요약 및 AI 인사이트</Text>
        </View>

        <View style={[styles.card, styles.sectionMargin]}>
          {aiInsightBlocks.length > 0 ? (
            aiInsightBlocks.map((block, blockIndex) => {
              if (block.type === 'paragraph') {
                return (
                  <Text
                    key={`insight-paragraph-${blockIndex}`}
                    style={[styles.aiInsightText, { marginBottom: pxToPt(8) }]}
                  >
                    {block.segments.map((segment, segmentIndex) => (
                      <Text
                        key={`insight-paragraph-${blockIndex}-segment-${segmentIndex}`}
                        style={
                          segment.isBold
                            ? {
                                fontFamily: 'Pretendard-Bold',
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

              return block.items.map((itemSegments, itemIndex) => (
                <View
                  key={`insight-list-${blockIndex}-${itemIndex}`}
                  style={styles.aiInsightItemRow}
                >
                  <Text style={styles.aiInsightText}>
                    {itemSegments.map((segment, segmentIndex) => (
                      <Text
                        key={`insight-list-${blockIndex}-${itemIndex}-segment-${segmentIndex}`}
                        style={
                          segment.isBold
                            ? {
                                fontFamily: 'Pretendard-Bold',
                                fontWeight: 700,
                              }
                            : undefined
                        }
                      >
                        {segment.text}
                      </Text>
                    ))}
                  </Text>
                </View>
              ))
            })
          ) : (
            <Text style={styles.aiInsightText}>데이터를 불러올 수 없습니다.</Text>
          )}
        </View> */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>시장 추이 차트</Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartLabel}>{data.marketTrends[0].date}</Text>
              <Text style={styles.chartLabel}>일간장중</Text>
              <Text style={styles.chartName}>KOSPI</Text>
            </View>
            <View style={styles.chartDivider} />
            {data.marketTrends[0]?.imageUrl && (
              <Image src={data.marketTrends[0].imageUrl} style={styles.chartImage} />
            )}
          </View>

          <View style={[styles.chartCard, styles.chartCardRight]}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartLabel}>{data.marketTrends[1].date}</Text>
              <Text style={styles.chartLabel}>일간장중</Text>
              <Text style={styles.chartName}>KOSDAQ</Text>
            </View>
            <View style={styles.chartDivider} />
            {data.marketTrends[1]?.imageUrl && (
              <Image src={data.marketTrends[1].imageUrl} style={styles.chartImage} />
            )}
          </View>
        </View>

        {/* 유의사항 */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>리포트 이용 안내</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.noticeText}>
            • 이 자료는 경제와 금융시장에 대한 이해를 돕기 위한 것으로, 정보 제공을 목적으로 한 원라인에이아이의 자체 조사·분석 결과입니다.
            {'\n'}• 이 자료는 인공지능이 생성한 콘텐츠입니다.{'\n'}• 본 자료는 투자 권유가 아니며, 투자 판단과 그에 따른 최종 책임은 전적으로 투자자 본인에게 있습니다.{'\n'}• 수집된 정보의 정확성과 완전성은 보장되지 않으며
            사전 고지 없이 변경되거나 수정될 수 있습니다.{'\n'}• 이 자료와 그 안에 포함된 모든 저작물은 원라인에이아이의 사전 서면 동의 없이 복제, 배포, 전송, 대여 등 어떤 형태로든 사용할 수 없습니다.
          </Text>
          <Image src='/summary-info.png' style={{ width: '100%'}} />
        </View>

        <Text style={styles.pageNumber}>03</Text>
      </Page>
    </Document>
  )
}
