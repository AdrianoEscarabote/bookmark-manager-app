import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const c = await cookies()

  c.set('demo', '', { path: '/', expires: new Date(0) })

  return NextResponse.redirect(
    new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  )
}
