import express from "express"

import { SignInController } from "@/controllers/sign-in/sign-in"
import { SignInRepository } from "@/repositories/sign-in"

const signInRoute = express.Router()

signInRoute.post("/", async (req, res) => {
  const signInRepository = new SignInRepository()
  const signInController = new SignInController(signInRepository)

  const { body, statusCode } = await signInController.handle(
    {
      body: req.body,
    },
    res,
  )

  return res.status(statusCode).json(body)
})

export default signInRoute
