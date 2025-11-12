import { QuestionItem } from '@/types/question/question'

export const welcomeConfig = {
  title: '안녕하세요, AI투자챗봇 입니다.',
  subtitle:
    'AI투자챗봇은 데이터 분석을 통해 좋은 결정을 돕는 \n조언을 드리고자 합니다. 투자에는 참고만 해주시고, \n최종 결정은 개인의 신중한 판단으로 진행해 주세요.',
  showIcon: false,
}

export const mockTabOptions = [
  { id: 'recommended', label: '추천 질문', isSelected: true },
  { id: 'popular', label: '실시간 인기 질문', isSelected: false },
  { id: 'stocks', label: '오늘의 인기 종목', isSelected: false },
]

export const mockQuestions: QuestionItem[] = [
  { id: '1', text: '전일 뉴욕증시 주요 뉴스 요약해줘', category: 'recommended', hasArrow: true },
  { id: '2', text: '테슬라 최신 어닝콜 요약해줘', category: 'recommended', hasArrow: true },
  { id: '3', text: '스타벅스 최신 뉴스 알려줘', category: 'recommended', hasArrow: true },
  { id: '4', text: '엔비디아에 대해 분석해줘', category: 'recommended', hasArrow: true },
  { id: '5', text: 'PROSHARES ULTRA SEMICONDUCTORS (USD)', category: 'popular', hasArrow: true },
  { id: '6', text: 'QQQ', category: 'popular', hasArrow: true },
  { id: '7', text: '전일 증시 요약해줘', category: 'popular', hasArrow: true },
  { id: '8', text: '국내 저PER 종목 알려줘', category: 'popular', hasArrow: true },
]

export const mockStocks = [
  {
    id: '1',
    name: '삼성전자',
    change: '+2.15%',
    iconUrl: '/samsung.png', // 예시 아이콘 URL
  },
  {
    id: '2',
    name: 'SK하이닉스',
    change: '-1.03%',
    iconUrl: '/hynix.png',
  },
  {
    id: '3',
    name: 'LG에너지솔루션',
    change: '+0.87%',
    iconUrl: '/lg.png',
  },
  {
    id: '4',
    name: '엔비디아',
    change: '+0.87%',
    iconUrl: '/nvidia.png',
  },
  {
    id: '5',
    name: '애플',
    change: '+0.87%',
    iconUrl: '/apple.png',
  },
  {
    id: '6',
    name: '스타벅스',
    change: '+0.87%',
    iconUrl: '/starbucks.png',
  },
]
