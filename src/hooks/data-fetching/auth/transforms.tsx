import { LoginRequest, Token, User } from '@/types/auth/model'

import * as T from '@/services/auth/types'

// Model -> DTO 변환 함수들
export const transformLoginRequestModel = (loginRequest: LoginRequest): T.LoginRequest => {
  return {
    grant_type: loginRequest.grant_type,
    username: loginRequest.username,
    password: loginRequest.password,
    scope: loginRequest.scope,
    client_id: loginRequest.client_id,
    client_secret: loginRequest.client_secret,
  }
}

export const transformGetMeRequestModel = (getMeRequest: {}): T.GetMeRequest => {
  return {}
}

// DTO -> Model 변환 함수들
export const transformTokenDTO = (token: T.Token): Token => {
  return {
    access_token: token.access_token,
    token_type: token.token_type,
    status: token.status,
  }
}

export const transformUserDTO = (user: T.User): User => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    position: user.position,
    department: user.department,
    status: user.status,
    emp_number: user.emp_number,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}
