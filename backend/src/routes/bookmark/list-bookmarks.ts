import express from "express"

import { ListBookmarksController } from "@/controllers/list-bookmarks/list-bookmarks"
import { BookmarksRepository } from "@/repositories/bookmarks"

const listBookmarksRoute = express.Router()

listBookmarksRoute.get("/", async (req, res) => {
  const userId = res.locals.userId as string | undefined
  if (!userId) return res.status(401).json({ message: "Unauthorized" })

  const bookmarksRepository = new BookmarksRepository()
  const listBookmarksController = new ListBookmarksController(bookmarksRepository)

  const { statusCode, body } = await listBookmarksController.handle({ body: { userId } })

  return res.status(statusCode).json(body)
})

export default listBookmarksRoute
