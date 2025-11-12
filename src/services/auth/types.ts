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
