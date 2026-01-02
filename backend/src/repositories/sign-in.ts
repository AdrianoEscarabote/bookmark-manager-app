import { compare } from "bcrypt"

import { ISignInRepository, SignInParams, SignInReturnTypes } from "@/controllers/sign-in/protocols"
import prisma from "@/database/prisma"

export class SignInRepository implements ISignInRepository {
  async signIn(params: SignInParams): Promise<SignInReturnTypes> {
    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const checkPassword = await compare(params.password, user.password)

    if (!checkPassword) {
      throw new Error("Invalid password")
    }

    const { id } = user

    return {
      id,
    }
  }
}
