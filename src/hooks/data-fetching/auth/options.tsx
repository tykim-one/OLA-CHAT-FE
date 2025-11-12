import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

import { LoginRequest, Token, User } from '@/types/auth/model'

import * as api from '@/services/auth/api'

import { keys } from './keys'
import { transformLoginRequestModel, transformTokenDTO, transformUserDTO } from './transforms'

// 옵션 타입 정의
export type LoginMutationOptions = Partial<UseMutationOptions<Token, any, LoginRequest>>
export type GetMeQueryOptions = Partial<UseQueryOptions<User>>

// 기본값 정의
const defaultLoginRequest: LoginRequest = {
  grant_type: undefined,
  username: '',
  password: '',
  scope: undefined,
  client_id: undefined,
  client_secret: undefined,
}

// 옵션 함수들
export const loginMutationOptions = (options?: LoginMutationOptions) => {
  return {
    ...options,
    mutationKey: keys.LOGIN(),
    mutationFn: async (loginRequest: LoginRequest) => {
      // 쿼리 호출시 nextjs의 렌더링 관련 오류 방지 코드
      await Promise.resolve()

      return api.login(transformLoginRequestModel(loginRequest)).then((d) => {
        return transformTokenDTO(d)
      })
    },
    retry: false,
  }
}

export const getMeQueryOptions = (options?: GetMeQueryOptions) => {
  return {
    ...options,
    queryKey: keys.GET_ME(),
    queryFn: async () => {
      // 쿼리 호출시 nextjs의 렌더링 관련 오류 방지 코드
      await Promise.resolve()

      return api.getMe({}).then((d) => {
        return transformUserDTO(d)
      })
    },
  }
}
