'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { useBookmarksStore } from '@/app/_store/bookmarks'

export function BookmarksBootstrap() {
  const pathname = usePathname()

  const hydrated = useBookmarksStore((s) => s.hydrated)
  const loading = useBookmarksStore((s) => s.loading)
  const fetchBookmarks = useBookmarksStore((s) => s.fetch)

  React.useEffect(() => {
    if (
      pathname.startsWith('/sign-in') ||
      pathname.startsWith('/sign-up') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password')
    )
      return

    if (hydrated || loading) return
    void fetchBookmarks()
  }, [pathname, hydrated, loading, fetchBookmarks])

  return null
}
