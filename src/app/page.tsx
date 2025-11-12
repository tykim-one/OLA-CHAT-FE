// 'use client'

// import { useEffect } from 'react'

// import { ModernChatContainer, WelcomeSection, useChatContainer } from '@/components/chat/modern'

// import { mockTabOptions, welcomeConfig } from '@/constants/config'
// import { useInitFromQueryParams } from '@/providers'
// import { InitFromQueryParamsProvider, ReactQueryProvider } from '@/providers'
// import { AuthProvider } from '@/providers/AuthContext'
// import { AuthGuard } from '@/components/AuthGuard'

// // 검증된 아이콘 컴포넌트
// const VerifiedIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M12.0004 3C10.8004 3 9.60039 3.6 9.00039 4.7C8.40159 4.54669 7.77341 4.55015 7.17634 4.71003C6.57926 4.86991 6.03341 5.18082 5.59135 5.61284C5.14928 6.04486 4.8259 6.58342 4.65234 7.17666C4.47878 7.7699 4.46089 8.39784 4.60039 9C3.60039 9.6 2.90039 10.8 2.90039 12C2.90039 13.2 3.60039 14.4 4.60039 15C4.30039 16.2 4.60039 17.5 5.60039 18.4C6.40039 19.2 7.70039 19.6 8.90039 19.4C9.50039 20.4 10.7004 21 11.9004 21C13.1004 21 14.3004 20.4 14.9004 19.3C16.1004 19.6 17.4004 19.3 18.3004 18.3C19.1004 17.5 19.5004 16.3 19.3004 15C20.3004 14.4 20.9004 13.2 20.9004 12C20.9004 10.8 20.3004 9.6 19.2004 9C19.5004 7.8 19.2004 6.5 18.2004 5.6C17.7729 5.17793 17.249 4.86631 16.674 4.69208C16.099 4.51785 15.4903 4.48624 14.9004 4.6C14.3004 3.6 13.1004 3 11.9004 3H12.0004Z"
//       stroke="#0F172A"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M9 12L11 14L15 10"
//       stroke="#0F172A"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// )

// /**
//  * 모던 채팅 시스템 데모 페이지
//  * Figma 디자인을 기반으로 한 새로운 채팅 인터페이스 테스트
//  */
// function ModernChatPageBase() {
//   const { isInitialized, queryParams } = useInitFromQueryParams()

//   // 채팅 컨테이너 훅 사용 (실제 API 연동)
//   const {
//     chatState,
//     messages,
//     inputValue,
//     activeTab,
//     isLoading,
//     error,
//     sessionId,
//     loadingState,
//     filteredQuestions,
//     filteredStocks,
//     sendMessage,
//     handleQuestionClick,
//     handleTabChange,
//     abortCurrentMessage,
//     setInputValue,
//     resetChat,
//     clearError,
//   } = useChatContainer({
//     initialState: 'idle',
//     welcomeConfig: welcomeConfig,
//     recommendedConfig: {
//       title: '처음이시면 아래의 추천 콘텐츠를 확인하세요!',
//       icon: <VerifiedIcon />,
//       tabs: mockTabOptions,
//       questions: [], // 이제 filteredQuestions를 사용하므로 빈 배열로 설정
//     },
//     // 초기 메시지 설정 (필요시)
//     initialMessage: undefined,
//     initialPrompt: queryParams?.initialPrompt ? queryParams.initialPrompt : undefined,
//   })

//   useEffect(() => {
//     const handleGestureStart = (event: any) => {
//       event.preventDefault()
//     }

//     document.addEventListener('gesturestart', handleGestureStart)
//     return () => {
//       document.removeEventListener('gesturestart', handleGestureStart)
//     }
//   }, [])

//   if (!isInitialized) {
//     return null
//   }

//   return (
//     <div className="h-[100dvh] md:h-screen overflow-hidden md:overflow-y-auto">
//       <div className="bg-white h-[100dvh] md:h-screen">
//         {/* 채팅 컨테이너 - 중앙 정렬 */}
//         <div className="max-w-6xl mx-auto h-full">
//           <div className="flex justify-center h-full">
//             <ModernChatContainer
//               chatState={chatState}
//               messages={messages}
//               isChatLoading={isLoading}
//               recommendedQuestions={filteredQuestions}
//               stocks={filteredStocks}
//               tabOptions={mockTabOptions}
//               welcomeConfig={welcomeConfig}
//               recommendedConfig={{
//                 title: '처음이시면 아래의 추천 콘텐츠를 확인하세요!',
//                 icon: <VerifiedIcon />,
//                 tabs: mockTabOptions,
//                 questions: filteredQuestions, // 실제 API 데이터 사용
//               }}
//               onSendMessage={sendMessage}
//               onQuestionClick={handleQuestionClick}
//               onTabChange={handleTabChange}
//               onAbort={abortCurrentMessage}
//               showWelcomeMessage={true} // ModernChatContainer에서 고정 헤더로 처리
//               showRecommendedContent={true}
//               inputValue={inputValue}
//               onInputChange={setInputValue}
//               activeTab={activeTab}
//               className="w-full max-w-[700px] h-full"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function ModernChatPage() {
//   return (
//     <ReactQueryProvider>
//       <InitFromQueryParamsProvider>
//         <AuthProvider>
//           <AuthGuard>
//             <ModernChatPageBase />
//           </AuthGuard>
//         </AuthProvider>
//       </InitFromQueryParamsProvider>
//     </ReactQueryProvider>
//   )
// }
