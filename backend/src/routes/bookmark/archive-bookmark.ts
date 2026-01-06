import express from "express"

import { ArchiveBookmarkController } from "@/controllers/archive-bookmark/archive-bookmark"
import { BookmarksRepository } from "@/repositories/bookmarks"

const archiveBookmarkRoute = express.Router()

archiveBookmarkRoute.patch("/", async (req, res) => {
  const userId = res.locals.userId as string | undefined
  if (!userId) return res.status(401).json({ message: "Unauthorized" })

  const bookmarksRepository = new BookmarksRepository()
  const archiveBookmarkController = new ArchiveBookmarkController(bookmarksRepository)

  const { body, statusCode } = await archiveBookmarkController.handle({
    body: { userId, ...req.body },
  })

  return res.status(statusCode).json(body)
})

export default archiveBookmarkRoute
