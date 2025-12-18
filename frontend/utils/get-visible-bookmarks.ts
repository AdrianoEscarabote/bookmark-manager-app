import type { SortValue } from '@/app/_store/filters'

export type BookmarkLike = {
  id: string
  title: string
  description?: string | null
  tags?: string[] | null
  createdAt: string
  lastVisited?: string | null
  visitCount: number
}

type Options = {
  sort: SortValue
  searchQuery?: string
  selectedTags?: string[]
}

export function getVisibleBookmarks<T extends BookmarkLike>(
  bookmarks: T[],
  { sort, searchQuery = '', selectedTags = [] }: Options,
): T[] {
  let arr = [...bookmarks]

  switch (sort) {
    case 'recently_visited':
      arr.sort(
        (a, b) => new Date(b.lastVisited ?? 0).getTime() - new Date(a.lastVisited ?? 0).getTime(),
      )
      break
    case 'most_visited':
      arr.sort((a, b) => b.visitCount - a.visitCount)
      break
    case 'recently_added':
    default:
      arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  const q = searchQuery.trim().toLowerCase()

  if (q) {
    arr = arr.filter((b) => {
      const inTitle = b.title.toLowerCase().includes(q)
      const inDesc = b.description?.toLowerCase().includes(q)
      const inTags = b.tags?.join(' ').toLowerCase().includes(q)
      return inTitle || inDesc || inTags
    })
  }

  if (selectedTags.length > 0) {
    arr = arr.filter((b) => {
      const bt = b.tags ?? []
      return selectedTags.some((t) => bt.includes(t))
    })
  }

  return arr
}
