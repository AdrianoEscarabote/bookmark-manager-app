import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  // páginas de autenticação (redirecionar usuário logado)
  const isAuthPage =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password')

  const token = req.cookies.get('token')?.value
  const id = req.cookies.get('id')?.value

  const isProtectedRoute = pathname === '/' || pathname.startsWith('/archived')

  const isLoggedIn = Boolean(token)

  if (!isLoggedIn && !isAuthPage && isProtectedRoute) {
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && isAuthPage) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/archived/:path*', '/sign-in', '/sign-up', '/forgot-password', '/reset-password'],
}
