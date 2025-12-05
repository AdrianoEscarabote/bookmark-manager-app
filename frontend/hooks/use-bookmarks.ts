import { useEffect } from 'react'

import { type Bookmark, useBookmarksStore } from '@/app/_store/bookmarks'

type Options = { archived?: boolean }

const useBookmarks = (opts?: Options) => {
  const items = useBookmarksStore((s) => s.items)
  const loading = useBookmarksStore((s) => s.loading)
  const error = useBookmarksStore((s) => s.error)
  const fetch = useBookmarksStore((s) => s.fetch)

  useEffect(() => {
    if (!items.length && !loading) fetch()
  }, [items.length, loading, fetch])

  const filtered =
    typeof opts?.archived === 'boolean'
      ? items.filter((b) => b.isArchived === opts.archived)
      : items

  return { data: filtered, loading, error }
}

export type { Bookmark }
export default useBookmarks
