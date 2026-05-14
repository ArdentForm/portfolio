import {createHmac} from 'crypto'

export const PORTFOLIO_COOKIE = 'portfolio-session'
export const PORTFOLIO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function generateSessionToken(): string {
  const secret = process.env.PORTFOLIO_SECRET ?? 'fallback-secret'
  const password = process.env.PORTFOLIO_PASSWORD ?? ''
  return createHmac('sha256', secret).update(password).digest('hex')
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false
  if (!process.env.PORTFOLIO_PASSWORD || !process.env.PORTFOLIO_SECRET) return false
  return token === generateSessionToken()
}
