/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { isDemoModeClient } from '@/app/_lib/demo-bookmarks'
import { api } from '@/utils/api'

export type UserProfile = {
  name: string
  email: string
}

export type UserState = {
  user?: UserProfile
  loading: boolean
  error?: string

  setUser: (u?: UserProfile) => void
  clear: () => void
  fetchMe: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      loading: false,
      error: undefined,

      setUser: (user) => set({ user }),
      clear: () => set({ user: undefined, loading: false, error: undefined }),

      fetchMe: async () => {
        if (isDemoModeClient()) {
          set({
            user: { name: 'Emily Carter', email: 'emily101@gmail.com' },
            loading: false,
            error: undefined,
          })
          return
        }

        if (get().loading) return

        set({ loading: true, error: undefined })
        try {
          const res = await api.get('/auth/authenticate-user')

          const name = (res.data?.name ?? '').toString()
          const email = (res.data?.email ?? '').toString()

          if (!name || !email) {
            set({ user: undefined, loading: false })
            return
          }

          set({ user: { name, email }, loading: false })
        } catch (e: any) {
          const status = e?.response?.status
          if (status === 401 || status === 403) {
            set({ user: undefined, loading: false, error: undefined })
            return
          }

          set({ loading: false, error: 'Failed to load user.' })
        }
      },
    }),
    {
      name: 'bm_user',
      partialize: (s) => ({ user: s.user }),
    },
  ),
)
