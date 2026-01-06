import express from "express"

import archiveBookmarkRoute from "./bookmark/archive-bookmark"
import createBookmarkRoute from "./bookmark/create-bookmark"
import deleteBookmarkRoute from "./bookmark/delete-bookmark"
import listBookmarksRoute from "./bookmark/list-bookmarks"
import updateBookmarkRoute from "./bookmark/update-bookmark"

const bookmarkRouter = express.Router()

bookmarkRouter.use("/create", createBookmarkRoute)
bookmarkRouter.use("/list", listBookmarksRoute)
bookmarkRouter.use("/archive", archiveBookmarkRoute)
bookmarkRouter.use("/update", updateBookmarkRoute)
bookmarkRouter.use("/delete", deleteBookmarkRoute)

export default bookmarkRouter
