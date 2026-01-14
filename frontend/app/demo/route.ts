import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const c = await cookies()

  c.set('demo', '1', {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  })

  c.set('token', '', { path: '/', expires: new Date(0) })
  c.set('id', '', { path: '/', expires: new Date(0) })

  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  )
}
