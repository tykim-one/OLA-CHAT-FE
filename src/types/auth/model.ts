// Auth 도메인 모델 타입들
// Server DTO 타입들을 기반으로 생성된 프론트엔드 모델 타입들

export type Response<T> = {
  status: number
  message: string | null
  data: T
  trace: string | null
  path: string
  error_code?: string
}

export const defaultResponse = <T>(data: T): Response<T> => ({
  status: 0,
  message: null,
  data,
  trace: null,
  path: '',
  error_code: undefined,
})

// Login Request/Response types
export type LoginRequest = {
  grant_type?: string
  username: string
  password: string
  scope?: string
  client_id?: string
  client_secret?: string
}

export const defaultLoginRequest: LoginRequest = {
  grant_type: undefined,
  username: '',
  password: '',
  scope: undefined,
  client_id: undefined,
  client_secret: undefined,
}

export type Token = {
  access_token?: string
  token_type?: string
  status?: string
}

export const defaultToken: Token = {
  access_token: undefined,
  token_type: undefined,
  status: undefined,
}

export type LoginResponse = Token

export const defaultLoginResponse: LoginResponse = defaultToken

// Get Me Request/Response types
export type GetMeRequest = {}

export const defaultGetMeRequest: GetMeRequest = {}

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

export const defaultUser: User = {
  id: 0,
  username: '',
  name: undefined,
  email: undefined,
  position: undefined,
  department: undefined,
  status: undefined,
  emp_number: undefined,
  role: undefined,
  created_at: undefined,
  updated_at: undefined,
}

export type GetMeResponse = User

export const defaultGetMeResponse: GetMeResponse = defaultUser

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ token: string; status: string }>
  logout: () => void
  isLoading: boolean
}