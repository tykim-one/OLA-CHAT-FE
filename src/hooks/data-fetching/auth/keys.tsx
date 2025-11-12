import { QueryKey } from '@tanstack/react-query'

import { LoginRequest, User } from '@/types/auth/model'

export const keys = {
  LOGIN: () => ['login'],
  GET_ME: () => ['getMe'],
} as const

export type AuthKeys = typeof keys
