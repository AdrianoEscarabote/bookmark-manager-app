import express from "express"

import { CreateBookmarkController } from "@/controllers/create-bookmark/create-bookmark"
import { BookmarksRepository } from "@/repositories/bookmarks"

const createBookmarkRoute = express.Router()

createBookmarkRoute.post("/", async (req, res) => {
  const bookmarksRepository = new BookmarksRepository()
  const createBookmarkController = new CreateBookmarkController(bookmarksRepository)

  const { statusCode, body } = await createBookmarkController.handle({ body: req.body })

  return res.status(statusCode).json(body)
})

export default createBookmarkRoute
