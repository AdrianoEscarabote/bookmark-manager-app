import type { Response } from "express"
import { Secret, sign } from "jsonwebtoken"
import z from "zod"

import { UserTypes } from "@/models/user"
import { SignUpRepository } from "@/repositories/sign-up"

import { badRequest, Conflict, registered } from "../helpers"
import { HttpRequest, HttpResponse, IController } from "../protocols"

import { SignUpParams, SignUpReturnTypes } from "./protocols"

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export class SignUpController implements IController {
  constructor(private readonly signUpRepository: SignUpRepository) {}

  async handle(
    HttpRequest: HttpRequest<SignUpParams>,
    res: Response,
  ): Promise<HttpResponse<SignUpReturnTypes | string>> {
    try {
      const parsed = signUpSchema.safeParse(HttpRequest.body)

      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Invalid data"
        return badRequest(message)
      }

      const user = await this.signUpRepository.signUp(parsed.data)

      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)

      const secret = process.env.SECRET as Secret

      const token = sign(
        {
          id: user.id,
        },
        secret,
      )

      res.cookie("id", user.id, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: expirationDate,
      })

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: expirationDate,
      })

      return registered<UserTypes>(user)
    } catch (error) {
      console.error(error)
      return Conflict()
    }
  }
}
