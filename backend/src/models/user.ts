export interface UserTypes {
  name: string
  email: string
  password: string
  createdAt: string
  id: string
  bookmarks: Bookmark[]
}

export interface Bookmark {
  userId: string
  id: string
  title: string
  url: string
  favicon: string
  description: string
  tags: string[]
  pinned: boolean
  isArchived: boolean
  visitCount: number
  createdAt: Date
  lastVisited: Date | null
}
