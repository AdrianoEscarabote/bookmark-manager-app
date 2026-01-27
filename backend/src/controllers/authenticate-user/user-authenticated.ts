import { badRequest, ok } from "../helpers"
import { HttpRequest, HttpResponse, IController } from "../protocols"

import {
  AuthenticateUserParams,
  AuthenticateUserReturn,
  IUserAuthenticatedRepository,
} from "./protocols"

export class AuthenticateUserController implements IController {
  constructor(private readonly userAuthenticatedRepository: IUserAuthenticatedRepository) {}

  async handle(
    HttpRequest: HttpRequest<AuthenticateUserParams>,
  ): Promise<HttpResponse<AuthenticateUserReturn | string>> {
    try {
      if (!HttpRequest.body?.token) {
        return badRequest("token not found!")
      }

      const { email, name } = await this.userAuthenticatedRepository.authenticateUser(
        HttpRequest.body,
      )

      return ok<AuthenticateUserReturn>({ email, name })
    } catch {
      return badRequest("Unauthenticated")
    }
  }
}
