import * as T from './types'

export const mocks = {
  LOGIN: {
    access_token: 'mock_access_token_12345',
    token_type: 'bearer',
    status: 'success',
  } as T.LoginResponse,

  GET_ME: {
    id: 1,
    username: 'testuser',
    name: '테스트 사용자',
    email: 'test@example.com',
    position: '개발자',
    department: 'IT팀',
    status: '승인완료',
    emp_number: 'EMP001',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  } as T.GetMeResponse,
} as const
