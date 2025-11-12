'use server'

import { authApi } from '@/lib/http'

import { endpoints } from './endpoints'
import * as T from './types'

export const login = async (args: T.LoginRequest) => {
  const formData = new URLSearchParams()

  if (args.grant_type) {
    formData.append('grant_type', args.grant_type)
  }
  formData.append('username', args.username)
  formData.append('password', args.password)

  if (args.scope) {
    formData.append('scope', args.scope)
  }
  if (args.client_id) {
    formData.append('client_id', args.client_id)
  }
  if (args.client_secret) {
    formData.append('client_secret', args.client_secret)
  }

  return authApi
    .post<T.LoginResponse>(endpoints.IBK_AUTH_LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((d) => d.data)
}

export const getMe = async (args: T.GetMeRequest) => {
  return authApi.get<T.GetMeResponse>(endpoints.IBK_AUTH_ME).then((d) => d.data)
}
