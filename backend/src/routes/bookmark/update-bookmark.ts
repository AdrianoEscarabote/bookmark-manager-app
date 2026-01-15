import express from "express"

import { UpdateBookmarkController } from "@/controllers/update-bookmark/update-bookmark"
import { BookmarksRepository } from "@/repositories/bookmarks"

const updateBookmarkRoute = express.Router()

updateBookmarkRoute.patch("/", async (req, res) => {
  const userId = res.locals.userId as string | undefined
  if (!userId) return res.status(401).json({ message: "Unauthorized" })

  const bookmarksRepository = new BookmarksRepository()
  const updateBookmarksController = new UpdateBookmarkController(bookmarksRepository)

  const { body, statusCode } = await updateBookmarksController.handle({
    body: { userId, ...req.body },
  })

  return res.status(statusCode).json(body)
})

export default updateBookmarkRoute
