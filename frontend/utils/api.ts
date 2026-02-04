import axios from 'axios'

import { useBookmarksStore } from '@/app/_store/bookmarks'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status

    if (status === 401 && typeof window !== 'undefined') {
      useBookmarksStore.getState().reset()
      if (window.location.pathname !== '/sign-in') window.location.assign('/sign-in')
    }

    return Promise.reject(error)
  },
)
