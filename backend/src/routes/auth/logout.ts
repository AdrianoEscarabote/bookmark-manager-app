import express from "express"

import { serverError } from "@/controllers/helpers"

const logoutRoute = express.Router()

logoutRoute.post("/", (req, res) => {
  try {
    res.clearCookie("id", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })

    return res.status(204).end()
  } catch (error) {
    console.log(error)
    return serverError()
  }
})

export default logoutRoute
