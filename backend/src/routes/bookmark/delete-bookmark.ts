import express from "express"

import { DeleteBookmarkController } from "@/controllers/delete-bookmark/delete-bookmark"
import { BookmarksRepository } from "@/repositories/bookmarks"

const deleteBookmarkRoute = express.Router()

deleteBookmarkRoute.delete("/", async (req, res) => {
  const userId = res.locals.userId as string | undefined
  if (!userId) return res.status(401).json({ message: "Unauthorized" })

  const bookmarksRepository = new BookmarksRepository()
  const deleteBookmarkController = new DeleteBookmarkController(bookmarksRepository)

  const { body, statusCode } = await deleteBookmarkController.handle({
    body: { userId, ...req.body },
  })

  return res.status(statusCode).json(body)
})

export default deleteBookmarkRoute
