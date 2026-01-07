export type UpdateBookmarkParams =
  | {
      userId: string
      bookmarkId: string
      action: "visit"
    }
  | {
      userId: string
      bookmarkId: string
      title?: string
      url?: string
      favicon?: string
      description?: string
      tags?: string[]
      pinned?: boolean
      isArchived?: boolean
      visitCount?: number
      lastVisited?: Date | null
    }

export interface UpdateBookmarkReturnTypes {
  id: string
}
