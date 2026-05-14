'use server'

import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

import {
  PORTFOLIO_COOKIE,
  PORTFOLIO_COOKIE_MAX_AGE,
  generateSessionToken,
} from '@/lib/portfolioAuth'

export async function unlockPortfolio(formData: FormData) {
  const submitted = formData.get('password') as string
  const from = (formData.get('from') as string) || '/portfolio'

  if (submitted !== process.env.PORTFOLIO_PASSWORD) {
    redirect(`/portfolio/unlock?from=${encodeURIComponent(from)}&error=1`)
  }

  const cookieStore = await cookies()
  cookieStore.set(PORTFOLIO_COOKIE, generateSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PORTFOLIO_COOKIE_MAX_AGE,
    path: '/portfolio',
  })

  redirect(from)
}
