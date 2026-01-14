import axios from 'axios'

import type { Bookmark } from '@/app/_store/bookmarks'

const LS_KEY = 'demo:bookmarks:v1'

function parseCookie(name: string) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

export function isDemoModeClient() {
  return parseCookie('demo') === '1'
}

export async function hydrateDemoBookmarks(): Promise<Bookmark[]> {
  if (typeof window === 'undefined') return []

  const cached = window.localStorage.getItem(LS_KEY)
  if (cached) return JSON.parse(cached) as Bookmark[]

  const { data } = await axios.get<{ bookmarks: Bookmark[] }>('/data.json', {
    headers: { 'Cache-Control': 'no-store' },
  })

  window.localStorage.setItem(LS_KEY, JSON.stringify(data.bookmarks))
  return data.bookmarks
}

export function saveDemoBookmarks(bookmarks: Bookmark[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, JSON.stringify(bookmarks))
}

export function resetDemoBookmarks() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LS_KEY)
}
