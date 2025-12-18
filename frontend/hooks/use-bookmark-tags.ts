import { useMemo } from 'react'

import { useBookmarksStore } from '@/app/_store/bookmarks'

type Options = { includeArchived?: boolean }

export default function useBookmarkTags(opts?: Options) {
  const items = useBookmarksStore((s) => s.items)
  const includeArchived = opts?.includeArchived ?? true

  const source = useMemo(
    () => (includeArchived ? items : items.filter((b) => !b.isArchived)),
    [items, includeArchived],
  )

  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const b of source) {
      for (const t of b.tags ?? []) {
        counts.set(t, (counts.get(t) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [source])
}
