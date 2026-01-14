/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

import {
  hydrateDemoBookmarks,
  isDemoModeClient,
  saveDemoBookmarks,
} from '@/app/_lib/demo-bookmarks'
import { api } from '@/utils/api'

export type Bookmark = {
  id: string
  title: string
  url: string
  favicon: string
  description: string
  tags: string[]
  pinned: boolean
  isArchived: boolean
  visitCount: number
  createdAt: string
  lastVisited: string | null
}

type State = {
  items: Bookmark[]
  loading: boolean
  hydrated: boolean
  error?: string
  source?: 'api' | 'demo'
}

type Actions = {
  fetch: () => Promise<void>
  setHydrated: (v: boolean) => void
  setItems: (items: Bookmark[]) => void
  reset: () => void
  toggleArchive: (id: string) => void
  togglePin: (id: string) => boolean
  incrementVisit: (id: string) => void
  remove: (id: string) => void
  update: (id: string, patch: Partial<Bookmark>) => void
  addBookmark: (bookmark: Bookmark) => void
}

export const PIN_LIMIT = 3

export const useBookmarksStore = create<State & Actions>((set, get) => {
  const persistIfDemo = () => {
    if (!isDemoModeClient()) return
    saveDemoBookmarks(get().items)
  }

  return {
    items: [],
    loading: false,
    hydrated: false,
    error: undefined,
    source: undefined,

    setHydrated: (v) => set({ hydrated: v }),
    setItems: (items) => set({ items }),

    reset: () =>
      set({ items: [], loading: false, hydrated: false, error: undefined, source: undefined }),

    fetch: async () => {
      const mode: State['source'] = isDemoModeClient() ? 'demo' : 'api'

      if (get().loading) return
      if (get().hydrated && get().source === mode) return

      set({ loading: true, error: undefined })

      try {
        if (mode === 'demo') {
          const items = await hydrateDemoBookmarks()
          set({ items, hydrated: true, loading: false, source: 'demo' })
          return
        }

        const res = await api.get('/bookmark/list')
        set({ items: res.data as Bookmark[], hydrated: true, loading: false, source: 'api' })
      } catch (e: any) {
        const status = e?.response?.status

        if (status === 401) {
          set({ loading: false, hydrated: false, error: undefined, source: undefined })
          return
        }

        set({
          loading: false,
          hydrated: false,
          error: 'Failed to load bookmarks',
          source: undefined,
        })
      }
    },

    toggleArchive: (id) => {
      set((s) => ({
        items: s.items.map((b) => (b.id === id ? { ...b, isArchived: !b.isArchived } : b)),
      }))
      persistIfDemo()
    },

    togglePin: (id) => {
      let canPin = true

      set((s) => {
        const current = s.items.find((b) => b.id === id)
        if (!current) return s

        const willPin = !current.pinned

        if (willPin) {
          const pinnedCount = s.items.filter((b) => b.pinned).length
          if (pinnedCount >= PIN_LIMIT) {
            canPin = false
            return s
          }
        }

        return {
          items: s.items.map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b)),
        }
      })

      persistIfDemo()
      return canPin
    },

    incrementVisit: (id) => {
      set((s) => ({
        items: s.items.map((b) =>
          b.id === id
            ? { ...b, visitCount: b.visitCount + 1, lastVisited: new Date().toISOString() }
            : b,
        ),
      }))
      persistIfDemo()
    },

    remove: (id) => {
      set((s) => ({ items: s.items.filter((b) => b.id !== id) }))
      persistIfDemo()
    },

    update: (id, patch) => {
      set((s) => ({
        items: s.items.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      }))
      persistIfDemo()
    },

    addBookmark: (bookmark) => {
      set((s) => ({ items: [bookmark, ...s.items] }))
      persistIfDemo()
    },
  }
})

export const selectTags = (s: Pick<State, 'items'>) => {
  const counts = new Map<string, number>()
  for (const b of s.items) {
    for (const t of b.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
