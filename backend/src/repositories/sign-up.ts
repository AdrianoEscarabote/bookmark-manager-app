import { genSalt, hash } from "bcrypt"

import { ISignUpRepository, SignUpParams, SignUpReturnTypes } from "@/controllers/sign-up/protocols"
import prisma from "@/database/prisma"

export class SignUpRepository implements ISignUpRepository {
  async signUp(params: SignUpParams): Promise<SignUpReturnTypes> {
    const userExists = await prisma.user.findUnique({
      where: { email: params.email },
    })

    if (userExists) {
      throw new Error("User already exists")
    }

    const salt = await genSalt(12)
    const passwordHash = await hash(params.password, salt)

    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        password: passwordHash,
        bookmarks: { create: [] },
      },
    })

    if (!user) {
      throw new Error("Error creating user")
    }

    const { email, id, name } = user

    return { id, email, name }
  }
}
