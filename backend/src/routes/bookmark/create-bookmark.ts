import express from "express"

import { CreateBookmarkController } from "@/controllers/create-bookmark/create-bookmark"
import { BookmarksRepository } from "@/repositories/bookmarks"

const createBookmarkRoute = express.Router()

createBookmarkRoute.post("/", async (req, res) => {
  const userId = res.locals.userId as string | undefined
  if (!userId) return res.status(401).json({ message: "Unauthorized" })

  const bookmarksRepository = new BookmarksRepository()
  const createBookmarkController = new CreateBookmarkController(bookmarksRepository)

  const { statusCode, body } = await createBookmarkController.handle({
    body: { userId, ...req.body },
  })

  return res.status(statusCode).json(body)
})

export default createBookmarkRoute
