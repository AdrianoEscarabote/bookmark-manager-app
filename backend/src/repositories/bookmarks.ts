import {
  ArchiveBookmarkParams,
  ArchiveBookmarkReturnTypes,
} from "@/controllers/archive-bookmark/protocols"
import {
  CreateBookmarkParams,
  CreateBookmarkReturnTypes,
} from "@/controllers/create-bookmark/protocols"
import {
  DeleteBookmarkParams,
  DeleteBookmarkReturnTypes,
} from "@/controllers/delete-bookmark/protocols"
import {
  ListBookmarksParams,
  ListBookmarksReturnTypes,
} from "@/controllers/list-bookmarks/protocols"
import { IBookmarkRepository } from "@/controllers/protocols"
import {
  UpdateBookmarkParams,
  UpdateBookmarkReturnTypes,
} from "@/controllers/update-bookmark/protocols"
import prisma from "@/database/prisma"

const PIN_LIMIT = 3

export class BookmarksRepository implements IBookmarkRepository {
  async create(params: CreateBookmarkParams): Promise<CreateBookmarkReturnTypes> {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: params.userId,
        title: params.title,
        url: params.url,
        favicon: params.favicon,
        description: params.description,
        tags: params.tags,
        pinned: params.pinned,
        isArchived: params.isArchived,
        visitCount: params.visitCount,
        createdAt: params.createdAt,
        lastVisited: params.lastVisited,
      },
    })

    return { id: bookmark.id }
  }

  async list(params: ListBookmarksParams): Promise<ListBookmarksReturnTypes> {
    const { userId } = params

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return bookmarks
  }

  async archive(params: ArchiveBookmarkParams): Promise<ArchiveBookmarkReturnTypes> {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: params.bookmarkId,
        userId: params.userId,
      },
    })

    if (!bookmark) {
      throw new Error("Bookmark not found")
    }

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmark.id },
      data: { isArchived: !bookmark.isArchived },
    })

    return { bookmarkId: updatedBookmark.id }
  }

  async update(params: UpdateBookmarkParams): Promise<UpdateBookmarkReturnTypes> {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) throw new Error("User not found")

    const bookmark = await prisma.bookmark.findFirst({
      where: { id: params.bookmarkId, userId: params.userId },
    })

    if (!bookmark) throw new Error("Bookmark not found")

    if ("action" in params) {
      const updated = await prisma.bookmark.update({
        where: { id: bookmark.id },
        data: {
          visitCount: { increment: 1 },
          lastVisited: new Date(),
        },
      })

      return { id: updated.id }
    } else {
      if (params.pinned === true && bookmark.pinned === false) {
        const pinnedCount = await prisma.bookmark.count({
          where: { userId: params.userId, pinned: true, isArchived: false },
        })

        if (pinnedCount >= PIN_LIMIT) {
          throw new Error(`You can only pin up to ${PIN_LIMIT} bookmarks.`)
        }
      }

      const data: Record<string, unknown> = {}
      if (params.title !== undefined) data.title = params.title
      if (params.url !== undefined) data.url = params.url
      if (params.favicon !== undefined) data.favicon = params.favicon
      if (params.description !== undefined) data.description = params.description
      if (params.tags !== undefined) data.tags = params.tags
      if (params.pinned !== undefined) data.pinned = params.pinned
      if (params.isArchived !== undefined) data.isArchived = params.isArchived
      if (params.visitCount !== undefined) data.visitCount = params.visitCount
      if (params.lastVisited !== undefined) data.lastVisited = params.lastVisited

      const updated = await prisma.bookmark.update({
        where: { id: bookmark.id },
        data,
      })

      return { id: updated.id }
    }
  }

  async delete(params: DeleteBookmarkParams): Promise<DeleteBookmarkReturnTypes> {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: params.bookmarkId,
        userId: params.userId,
      },
    })

    if (!bookmark) {
      throw new Error("Bookmark not found")
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    })

    return { success: true }
  }
}
