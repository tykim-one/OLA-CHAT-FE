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

/**
 * 이메일 인증코드 발송
 */
export const sendVerificationCode = async (args: T.SendVerificationCodeRequest) => {
  return authApi
    .post<T.SendVerificationCodeResponse>(endpoints.SEND_VERIFICATION_CODE, {
      email: args.email,
    })
    .then((d) => d.data)
}

/**
 * 이메일 인증코드 확인
 */
export const verifyEmail = async (args: T.VerifyEmailRequest) => {
  return authApi
    .post<T.VerifyEmailResponse>(endpoints.VERIFY_EMAIL, {
      email: args.email,
      code: args.code,
    })
    .then((d) => d.data)
}

/**
 * 로그인 (새 버전)
 */
export const signIn = async (args: T.SignInRequest) => {
  return authApi
    .post<T.SignInResponse>(endpoints.SIGN_IN, {
      email: args.email,
      password: args.password,
    })
    .then((d) => d.data)
}

/**
 * 회원가입
 */
export const signUp = async (args: T.SignUpRequest) => {
  return authApi
    .post<T.SignUpResponse>(endpoints.SIGN_UP, {
      email: args.email,
      password: args.password,
      name: args.name,
      company: args.company,
      department: args.department,
      phone: args.phone,
      position: args.position,
    })
    .then((d) => d.data)
}
