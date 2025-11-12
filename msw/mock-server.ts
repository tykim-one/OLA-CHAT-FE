import { createMiddleware } from '@mswjs/http-middleware'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { stringify } from 'querystring'

import { handlers } from '@/http'

dotenv.config({
  path: '.env',
})

const app = express()
const port = Number(process.env.MOCK_SERVER_PORT)

// HTTP 서버 생성
const server = createServer(app)
const token = ''
app.use(cors())
app.use((req: any, res, next) => {
  req.headers.authorization = `Bearer ${token}`
  next()
})

app.use(express.json())
app.use(createMiddleware(...handlers) as any)

// Express 서버 대신 HTTP 서버 시작
server.listen(port, () => console.log(`mock server ${port} start`))

export { app, server }
