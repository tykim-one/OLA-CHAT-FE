// PdfReport.tsx
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// ▸ 한글 폰트를 쓰려면 TTF 파일을 import 후 등록
Font.register({
  family: 'NotoSansKR',
  src: '/fonts/NotoSansKR-Regular.ttf',
  fontStyle: 'normal',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 24,
    paddingBottom: 44,
    paddingHorizontal: 38,
  },
  border: {
    borderStyle: 'solid',
    borderColor: '#d1d5db', // slate-200
    borderWidth: 1,
    maxWidth: 992,
    maxHeight: 700,
    alignSelf: 'center',
  },
  header: {
    fontFamily: 'NotoSansKR',
    fontSize: 16,
    fontWeight: 600,
    color: '#0f172a', // slate-900
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb', // slate-200
    marginBottom: 16,
  },
  title: {
    fontFamily: 'NotoSansKR',
    fontSize: 18,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 12,
  },
  listItem: {
    fontFamily: 'NotoSansKR',
    fontSize: 12,
    color: '#334155', // slate-700
    marginBottom: 8,
    lineHeight: 1.4,
    flexDirection: 'row',
  },
  bullet: { marginRight: 4 },
  image: {
    width: '100%',
    height: 275,
    objectFit: 'cover',
    marginTop: 8,
    marginBottom: 12,
  },
  pageNum: {
    position: 'absolute',
    bottom: 20,
    right: 38,
    fontSize: 10,
    color: '#334155',
  },
})

// 타입은 기존 컴포넌트와 동일
interface Props {
  headerTitle: string
  title: string
  content: string[]
  image?: string
  pageNumber: number
}

export const PdfReport = ({ headerTitle, title, content, image, pageNumber }: Props) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        {/* Header */}
        <Text style={styles.header}>{headerTitle}</Text>
        <View style={styles.separator} />

        {/* Body */}
        <View>
          <Text style={styles.title}>{title}</Text>
          {content.map((txt, idx) => (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text>{txt}</Text>
            </View>
          ))}
        </View>

        {/* Image */}
        {image && <Image src={image} style={styles.image} />}

        {/* Page number */}
        <Text style={styles.pageNum}>{String(pageNumber).padStart(2, '0')}</Text>
      </View>
    </Page>
  </Document>
)
