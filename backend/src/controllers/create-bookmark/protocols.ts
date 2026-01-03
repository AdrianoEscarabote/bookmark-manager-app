export interface CreateBookmarkParams {
  userId: string
  title: string
  url: string
  description: string
  favicon: string
  tags: string[]
  pinned: boolean
  isArchived: boolean
  visitCount: number
  createdAt: string
  lastVisited: string | null
}

export interface CreateBookmarkReturnTypes {
  id: string
}
