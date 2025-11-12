// Mock handlers for auth domain
// Note: MSW is not installed, so these are placeholder handlers
// To use these handlers, install MSW: npm install msw
import { endpoints } from './endpoints'
import { mocks } from './mocks'

export const handlers = [
  // POST /ibk/auth/login
  {
    method: 'POST',
    path: endpoints.IBK_AUTH_LOGIN,
    response: mocks.LOGIN,
  },

  // GET /ibk/auth/me
  {
    method: 'GET',
    path: endpoints.IBK_AUTH_ME,
    response: mocks.GET_ME,
  },
]
