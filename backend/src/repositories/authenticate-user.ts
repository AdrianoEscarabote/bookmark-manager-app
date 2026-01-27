import { JwtPayload, Secret, verify } from "jsonwebtoken"

import {
  AuthenticateUserParams,
  AuthenticateUserReturn,
  IUserAuthenticatedRepository,
} from "@/controllers/authenticate-user/protocols"
import prisma from "@/database/prisma"

export class AuthenticateUserRepository implements IUserAuthenticatedRepository {
  async authenticateUser(params: AuthenticateUserParams): Promise<AuthenticateUserReturn> {
    if (!params.token) throw new Error("token not found")

    const secret = process.env.SECRET as Secret
    const payload = verify(params.token, secret) as JwtPayload

    const userId = payload?.id as string | undefined
    if (!userId) throw new Error("invalid token payload")

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error("User not found")

    return { name: user.name, email: user.email }
  }
}
