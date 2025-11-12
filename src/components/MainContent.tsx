import { useState } from 'react'

import { MainContentProps } from '@/types'

import QuestionList from './question/QuestionList'

// 공시 URL 생성 함수
const generateDisclosureUrl = (rcept_no: string) => {
  return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rcept_no}`
}

// 기본 iframe URL들 (공시 데이터가 없을 때 사용)
const DEFAULT_IFRAME_URLS = [
  { url: 'https://www.kakao.com', label: '카카오' },
  { url: 'https://www.naver.com', label: '네이버' },
  { url: 'https://www.google.com', label: '구글' },
  { url: 'https://www.daum.net', label: '다음' },
  { url: 'https://www.youtube.com', label: '유튜브' },
]

export default function MainContent({
  title = '추천 질문',
  description = '질문을 클릭해서 채팅을 시작해보세요.',
  questions,
  onQuestionClick,
  iframeUrl,
  disclosureData,
  onDisclosureSelect,
}: MainContentProps) {
  // 현재 iframe URL 인덱스를 관리하는 상태
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)

  // 공시 데이터가 있으면 공시 URL을 사용, 없으면 기본 URL 사용
  const availableUrls =
    disclosureData && disclosureData.length > 0
      ? disclosureData.map((item) => ({
          url: generateDisclosureUrl(item),
        }))
      : DEFAULT_IFRAME_URLS

  // 다음 URL로 변경하는 함수
  const handleChangeUrl = () => {
    const nextIndex = (currentUrlIndex + 1) % availableUrls.length
    setCurrentUrlIndex(nextIndex)

    // 공시 데이터가 있으면 onDisclosureSelect 콜백 호출
    if (disclosureData && disclosureData.length > 0) {
      const nextItem = availableUrls[nextIndex]
      if ('rcept_no' in nextItem && typeof nextItem.rcept_no === 'string') {
        onDisclosureSelect?.(nextItem.rcept_no)
      }
    }
  }

  // 현재 선택된 URL과 라벨
  const currentIframeData = availableUrls[currentUrlIndex]

  return (
    <div style={{ flex: '2.5' }} className="p-[16px] sm:p-[16px] min-w-0">
      {/* iframe이 있을 때 */}
      {iframeUrl ? (
        <div className="h-full flex flex-col">
          {/* iframe 헤더 - 닫기 버튼 포함 */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900">공시 확인하기</h3>
              <p className="text-sm text-slate-400">
                {disclosureData && disclosureData.length > 0
                  ? '조회된 공시 문서를 확인해보세요.'
                  : '등록된 공시를 확인해보세요.'}
              </p>
            </div>

            {/* URL 변경 버튼 */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                {/* <span className="text-sm text-gray-600">현재: {currentIframeData.label}</span> */}
                {disclosureData && disclosureData.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {currentUrlIndex + 1} / {availableUrls.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleChangeUrl}
                className="px-4 py-2 bg-[#004ca5] text-white rounded-lg hover:bg-[#003a7d] transition-colors duration-200 text-sm font-medium"
                disabled={availableUrls.length <= 1}
              >
                {availableUrls.length > 1 ? '다음 페이지' : '페이지 1개'}
              </button>
            </div>
          </div>

          {/* iframe 컨테이너 */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <iframe
              src={currentIframeData.url}
              className="w-full h-full"
              style={{ minHeight: '600px' }}
              frameBorder="0"
              // title={`공시 문서 - ${currentIframeData.label}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              key={currentIframeData.url} // URL이 변경될 때마다 iframe을 새로 렌더링
            />
          </div>

          {/* 공시 데이터 정보 표시 */}
          {disclosureData && disclosureData.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>조회된 공시 데이터:</strong> {disclosureData.length}개
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {/* 현재 표시: {currentIframeData.label} */}
                {'rcept_no' in currentIframeData &&
                  typeof currentIframeData.rcept_no === 'string' && (
                    <span className="ml-2">(접수번호: {currentIframeData.rcept_no})</span>
                  )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // iframe이 없을 때 - 기존 콘텐츠
        <>
          {/* 페이지 제목 */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-gray-600">{description}</p>
          </div>

          {/* 질문 목록 */}
          <QuestionList questions={questions} onQuestionClick={onQuestionClick} />
        </>
      )}
    </div>
  )
}
