'use client'

import { useState } from 'react'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
      mutationCache: new MutationCache({
        onSuccess: (data: any, variables: any, context, mutation) => {},
        onError: (error, query) => {},
      }),
      queryCache: new QueryCache({
        onError: (error, query) => {},
        onSuccess: (data: any, query) => {},
        onSettled(data, error, query) {},
      }),
    })

    return client
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
