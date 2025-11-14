// PdfReportDocument.tsx
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

type ReportItem = {
  headerTitle: string
  title: string
  content: string[]
  image?: string
  pageNumber: number
}

// 새로운 타입 정의를 상단으로 이동
type PortfolioData = {
  recommendedProducts: {
    funds?: Array<{
      name: string
      investment_point: string
      type?: string
    }>
    etfs?: Array<{
      name: string
      investment_point: string
      type?: string
    }>
  }
  performanceRows: Array<{
    name: string
    price: string
    return3m: string
    return6m: string
    return1y: string
    return2y: string
  }>
}

type ReportMeta = {
  title: string
  period: 'daily' | 'weekly' | 'monthly'
}

Font.register({
  family: 'Pretendard-Regular',
  src: '/fonts/Pretendard-Regular.ttf',
})

Font.register({
  family: 'Pretendard-Bold',
  src: '/fonts/Pretendard-Bold.ttf',
})

const pxToPt = (px: number): number => {
  return px * 0.75
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    maxWidth: pxToPt(992),
    maxHeight: pxToPt(700),
  },
  border: {
    // borderStyle: 'solid',
    // borderColor: '#d1d5db',
    // borderWidth: pxToPt(1),
    maxWidth: pxToPt(992),
    maxHeight: pxToPt(700),
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    paddingTop: pxToPt(24),
    paddingBottom: pxToPt(44),
    paddingHorizontal: pxToPt(38),
  },
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: pxToPt(10),
    borderRadius: pxToPt(10),
  },
  
  // 헤더 배경 이미지
  headerBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  
  // 헤더 콘텐츠 (배경 위에 표시)
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  headerImage: {
    width: pxToPt(26),
    height: pxToPt(26),
    marginRight: pxToPt(8),
  },
  headerBorderImage: {
    maxWidth: pxToPt(1123),
    width: '100%',
    height: pxToPt(4), // 원하는 높이(px 기준)
    objectFit: 'cover',
  },
  howsImage: {
    width: pxToPt(46),
    height: pxToPt(46),
    marginLeft: pxToPt(8),
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
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(24),
    fontWeight: 700,
    color: '#003F88',
    // marginBottom: pxToPt(4),
  },
  separator: {
    height: pxToPt(1),
    backgroundColor: '#e2e8f0',
    marginBottom: pxToPt(12),
    marginTop: pxToPt(12),
  },
  redText: {
    fontFamily: 'Pretendard-Bold',
    border: '2px solid #ff0000',
    color: '#ff0000',
    padding: pxToPt(6),
    borderRadius: pxToPt(8),
    fontSize: pxToPt(12),
    fontWeight: 700,
    flexDirection: 'row',
    textAlign: 'center', // 텍스트 가운데 정렬
    alignSelf: 'center',
  },

  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: pxToPt(20),
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: pxToPt(12),
  },
  listItem: {
    fontFamily: 'Pretendard-Regular',
    fontSize: pxToPt(16),
    color: '#334155',
    marginBottom: pxToPt(12),
    flexDirection: 'row',
    lineHeight: pxToPt(2), // 줄 높이 충분히 크게
    flexWrap: 'wrap', // 줄바꿈 허용
    alignItems: 'flex-start',
  },
  bullet: { marginRight: pxToPt(10) },
  image: {
    width: '100%',
    height: pxToPt(275),
    objectFit: 'cover',
    marginTop: pxToPt(8),
    marginBottom: pxToPt(12),
  },
  pageNum: {
    position: 'absolute',
    bottom: pxToPt(20),
    right: pxToPt(38),
    fontSize: pxToPt(10),
    color: '#334155',
  },
  contentWrapper: {
    height: pxToPt(275),
    overflow: 'hidden',
  },
})

const imageMapping: Record<string, string> = {
  '시장 전망 브리핑': '/image.png',
  '세계 경제 동향': '/image-1.png',
  '해외 채권 동향': '/image-2.png',
  '국내 증시 동향': '/image-3.png',
  '국내 채권 동향': '/image-4.png',
  '추천 투자 포트폴리오': '/image-5.png',
}

const periodImageMap: Record<string, string> = {
  daily: '/daily.png',
  weekly: '/weekly.png',
  monthly: '/monthly.png',
}

const renderPortfolioPage = (pageNumber: number, portfolioData: PortfolioData) => {
  const funds = portfolioData?.recommendedProducts?.funds ?? []
  const etfs = portfolioData?.recommendedProducts?.etfs ?? []
  const performanceRows = portfolioData?.performanceRows ?? []

  const rows = [
    ...funds.map((fund) => ({
      type: fund.type || '추천 펀드',
      name: fund.name,
      investment_point: fund.investment_point,
    })),
    ...etfs.map((etf) => ({
      type: etf.type || '유망 ETF',
      name: etf.name,
      investment_point: etf.investment_point,
    })),
  ]

  // ✅ 데이터가 전혀 없으면 페이지 자체를 렌더하지 않음
  if (rows.length === 0 && performanceRows.length === 0) {
    return null
  }


  return (
    <Page key="portfolio" size="A4" orientation="landscape" style={styles.page}>
      
      <View style={styles.border}>
        {/* 헤더 */}
        <View style={styles.headerContainer}>
          {/* 배경 이미지 (선택사항) */}
          <Image src="/reportHeader.png" style={styles.headerBackgroundImage} />
          
          {/* 헤더 콘텐츠 */}
          <View style={styles.headerContent}>
            <View style={styles.leftGroup}>
              <Image src="/image-5.png" style={styles.headerImage} />
              <Text style={styles.header}>시황 관련 상품</Text>
            </View>
            </View>
        </View>
        <View style={styles.separator} />

        {/* 최적 포트폴리오 구성 테이블 */}
        <Text style={styles.title}>시황 관련 상품</Text>
        <View style={{ flexDirection: 'row', borderBottom: '1pt solid #e2e8f0' }}>
          <Text
            style={{
              width: pxToPt(134),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
              textAlign: 'center',
            }}
          >
            구분
          </Text>
          <Text
            style={{
              width: pxToPt(391),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
              textAlign: 'center',
            }}
          >
            추천 펀드/ETF
          </Text>
          <Text
            style={{
              width: pxToPt(391),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
              textAlign: 'center',
            }}
          >
            핵심 투자 포인트
          </Text>
        </View>
        {rows.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', borderBottom: '1pt solid #e2e8f0' }}>
            <Text
              style={{
                width: pxToPt(134),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {item.type}
            </Text>
            <Text
              style={{
                width: pxToPt(391),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                width: pxToPt(391),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {item.investment_point}
            </Text>
          </View>
        ))}

        {/* 포트폴리오 최근 성과 테이블 */}
        <Text style={[styles.title, { marginTop: pxToPt(24) }]}>시황 관련 상품 성과</Text>
        <View style={{ flexDirection: 'row', borderBottom: '1pt solid #e2e8f0' }}>
          <Text
            style={{
              width: pxToPt(437),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            펀드/ETF명
          </Text>
          <Text
            style={{
              width: pxToPt(96),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            현재 기준가
          </Text>
          <Text
            style={{
              width: pxToPt(96),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            3개월 수익률
          </Text>
          <Text
            style={{
              width: pxToPt(95),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            6개월 수익률
          </Text>
          <Text
            style={{
              width: pxToPt(96),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            1년 수익률
          </Text>
          <Text
            style={{
              width: pxToPt(96),
              backgroundColor: '#f1f5f9',
              fontWeight: 700,
              paddingVertical: pxToPt(8),
              paddingHorizontal: pxToPt(6),
              textAlign: 'center',
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(14),
            }}
          >
            2년 수익률
          </Text>
        </View>
        {portfolioData.performanceRows.map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', borderBottom: '1pt solid #e2e8f0' }}>
            <Text
              style={{
                width: pxToPt(437),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.name}
            </Text>
            <Text
              style={{
                width: pxToPt(96),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.price}
            </Text>
            <Text
              style={{
                width: pxToPt(96),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.return3m}
            </Text>
            <Text
              style={{
                width: pxToPt(96),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.return6m}
            </Text>
            <Text
              style={{
                width: pxToPt(96),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.return1y}
            </Text>
            <Text
              style={{
                width: pxToPt(96),
                paddingVertical: pxToPt(8),
                paddingHorizontal: pxToPt(6),
                textAlign: 'center',
                fontFamily: 'Pretendard-Regular',
                fontSize: pxToPt(12),
              }}
            >
              {row.return2y}
            </Text>
          </View>
        ))}

        {/* 하단 이미지 및 페이지 번호 */}
        <Image
          src="/finish.png"
          style={{
            width: pxToPt(400),
            height: pxToPt(100),
            position: 'absolute',
            bottom: 0,
            right: 0,
            opacity: 0.5,
          }}
        />
        <Text style={styles.pageNum}>{String(pageNumber).padStart(2, '0')}</Text>
      </View>
    </Page>
  )
}

// 표지 페이지 렌더링 함수 추가
const renderCoverPage = (reportMeta: ReportMeta) => {
  const coverImage = periodImageMap[reportMeta.period]

  console.log(coverImage)
  const today = new Date()
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .slice(0, 12)

  return (
    <Page key="cover" size="A4" orientation="landscape" style={styles.page}>
      <View
        style={{
          flex: 1,
          position: 'relative',
          width: pxToPt(992),
          height: pxToPt(701),
        }}
      >
        <Image
          src={coverImage}
          style={{
            width: pxToPt(992),
            height: pxToPt(701),
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        <View
          style={{
            position: 'absolute',
            top: pxToPt(308),
            left: pxToPt(72),
            width: pxToPt(800),
            height: pxToPt(50),
          }}
        >
          <Text
            style={{
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(24),
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'left',
            }}
          >
            {reportMeta.title}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: pxToPt(616),
            left: pxToPt(72),
            width: pxToPt(800),
            height: pxToPt(50),
          }}
        >
          <Text
            style={{
              fontFamily: 'Pretendard-Bold',
              fontSize: pxToPt(20),
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'left',
            }}
          >
            {today}
          </Text>
        </View>
      </View>
    </Page>
  )
}

type ReportData = Record<
  string,
  {
    title: string
    content: string[]
    image?: string
  }
>

type PdfReportDocumentProps = {
  data: ReportData
  portfolioData: PortfolioData
  reportMeta: ReportMeta
}

export const PdfReportDocument = ({ data, portfolioData, reportMeta }: PdfReportDocumentProps) => {
  /* sampleReports 객체 → 배열 변환 */
  // data가 null이나 undefined인 경우를 방어
  const safeData = data || {}



  const reportsArray: ReportItem[] = Object.entries(safeData).map(([key, value], index) => ({
    headerTitle: key || '',
    title: value?.title || '',
    content: value?.content || [],
    image: value?.image,
    pageNumber: index + 1,
  }))

  return (
    <Document>
      {/* 표지 페이지 추가 */}
      {renderCoverPage(reportMeta)}

      {/* 기존 리포트 페이지들 */}
      {reportsArray
        .filter((r) => r.headerTitle && r.headerTitle.trim() !== '') // ✅ 대제목이 존재하는 경우만
        .map((r) => (
          <Page key={r.pageNumber} size="A4" orientation="landscape" style={styles.page}>
            <Image src="/header-b-border.png" style={styles.headerBorderImage} />
            <View style={styles.border}>
              {/* header */}

              <View style={styles.headerContainer}>
                {/* 배경 이미지 */}
                <Image src="/reportHeader.png" style={styles.headerBackgroundImage} />
                
                {/* 헤더 콘텐츠 */}
                <View style={styles.headerContent}>
                  <View style={styles.leftGroup}>
                    <Image src={imageMapping[r.headerTitle]} style={styles.headerImage} />
                    <Text style={styles.header}>{r.headerTitle}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.separator} />

              {/* body */}
              <View style={styles.contentWrapper}>
                <Text style={styles.title}>{r.title}</Text>
                {r.content.map((txt, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={{ flex: 1 }}>{txt}</Text>
                  </View>
                ))}
              </View>

              {/* image */}
              {r.image && <Image src={r.image} style={styles.image} />}

              {/* page number */}

              <Text style={styles.pageNum}>{String(r.pageNumber).padStart(2, '0')}</Text>
            </View>
          </Page>
        ))}

      {/* 포트폴리오 페이지 - 실제 데이터 사용 */}
      {renderPortfolioPage(reportsArray.length + 1, portfolioData)}
    </Document>
  )
}
