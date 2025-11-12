import { useIsMutating, useMutation, useQuery } from '@tanstack/react-query'

import { LoginRequest } from '@/types/auth/model'

import { keys } from './keys'
import {
  GetMeQueryOptions,
  LoginMutationOptions,
  getMeQueryOptions,
  loginMutationOptions,
} from './options'

// 쿼리 훅들
export const useGetMeQuery = (options?: GetMeQueryOptions) => {
  return useQuery(getMeQueryOptions(options))
}

// 뮤테이션 훅들
export const useLoginMutation = (options?: LoginMutationOptions) => {
  return useMutation(loginMutationOptions(options))
}

// isMutating 훅들
export const useIsMutatingLogin = () => {
  const count = useIsMutating({ mutationKey: keys.LOGIN() })
  return { count, isMutating: !!count }
}
