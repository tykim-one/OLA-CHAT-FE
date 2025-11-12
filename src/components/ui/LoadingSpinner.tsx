interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = '페이지 로딩 중...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}
