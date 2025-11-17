export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

// Login Request/Response types
export type LoginRequest = {
  grant_type?: string
  username: string
  password: string
  scope?: string
  client_id?: string
  client_secret?: string
}

export type Token = {
  access_token?: string
  token_type?: string
  status?: string
}

export type LoginResponse = Token

// Get Me Request/Response types
export type GetMeRequest = {}

export type User = {
  id: number
  username: string
  name?: string
  email?: string
  position?: string
  department?: string
  status?: string
  emp_number?: string
  role?: string
  created_at?: string
  updated_at?: string
}

export type GetMeResponse = User

// 회원가입 관련 타입들
// 인증코드 발송 Request
export type SendVerificationCodeRequest = {
  email: string
}

export type SendVerificationCodeResponse = {
  message: string
}

// 이메일 인증 Request/Response
export type VerifyEmailRequest = {
  email: string
  code: string
}

export type VerifyEmailResponse = {
  detail: string
  message: string
}

// 회원가입 Request/Response
export type SignUpRequest = {
  email: string
  password: string
  name: string
  company: string
  department: string
  phone: string
  position?: string
}

export type SignUpResponse = {
  message: string
  user: User
}

// 로그인 Request/Response (새 버전)
export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  access_token: string
  token_type: string
  user: User
}
