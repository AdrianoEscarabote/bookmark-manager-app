import express from "express"

import { SignUpController } from "@/controllers/sign-up/sign-up"
import { SignUpRepository } from "@/repositories/sign-up"

const signUpRoute = express.Router()

signUpRoute.post("/", async (req, res) => {
  const signUpRepository = new SignUpRepository()

  const signUpController = new SignUpController(signUpRepository)

  const { body, statusCode } = await signUpController.handle(
    {
      body: req.body,
    },
    res,
  )

  res.status(statusCode).send(body)
})

export default signUpRoute
