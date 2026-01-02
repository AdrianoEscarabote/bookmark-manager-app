import type { Response } from "express"
import { Secret, sign } from "jsonwebtoken"
import z from "zod"

import { UserTypes } from "@/models/user"

import { badRequest, logged } from "../helpers"
import { HttpRequest, HttpResponse, IController } from "../protocols"

import { ISignInRepository, SignInParams, SignInReturnTypes } from "./protocols"

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export class SignInController implements IController {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async handle(
    HttpRequest: HttpRequest<SignInParams>,
    res: Response,
  ): Promise<HttpResponse<SignInReturnTypes | string>> {
    try {
      const parsed = signInSchema.safeParse(HttpRequest.body ?? {})

      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Invalid data"
        return badRequest(message)
      }

      const user = await this.signInRepository.signIn(parsed.data)

      const secret = process.env.SECRET as Secret

      const token = sign(
        {
          id: user.id,
        },
        secret,
      )

      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)

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

      return logged<UserTypes>({ id: user.id })
    } catch (error) {
      console.log(error)

      if (error instanceof Error) {
        if (error.message === "User not found" || error.message === "Invalid password") {
          return badRequest(error.message)
        }
      }

      return badRequest("Internal server error")
    }
  }
}
