import express, { Request, Response } from "express"

import { AuthenticateUserController } from "@/controllers/authenticate-user/user-authenticated"
import { AuthenticateUserRepository } from "@/repositories/authenticate-user"

const authenticateUserRoute = express.Router()

authenticateUserRoute.get("/", async (req: Request, res: Response) => {
  const token = req.cookies.token

  const authenticateUserRepository = new AuthenticateUserRepository()

  const authenticateUserController = new AuthenticateUserController(authenticateUserRepository)

  const { body, statusCode } = await authenticateUserController.handle({
    body: { token },
  })

  res.status(statusCode).send(body)
})

export default authenticateUserRoute
