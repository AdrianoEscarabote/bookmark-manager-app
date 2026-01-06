import { Bookmark } from "@/models/user"

export interface ListBookmarksParams {
  userId: string
}

export type ListBookmarksReturnTypes = Bookmark[]
