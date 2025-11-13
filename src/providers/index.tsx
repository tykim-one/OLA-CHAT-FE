export * from './ReactQueryProvider'
export { InitFromQueryParamsProvider, useInitFromQueryParams } from '../contexts/InitFromQueryParamsProvider'



import { AuthProvider } from './AuthContext'
import { ReactQueryProvider } from './ReactQueryProvider'
import { ReportProvider } from './ReportContext'

interface AppProviderProps {
  children: React.ReactNode
}

/**
 * 애플리케이션의 모든 Provider들을 조합하는 컴포넌트
 * Provider 순서: QueryProvider > AuthProvider > ReportProvider
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ReportProvider>{children}</ReportProvider>
      </AuthProvider>
    </ReactQueryProvider>
  )
}
