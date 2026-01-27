export interface AuthenticateUserParams {
  token: string
}

export interface AuthenticateUserReturn {
  name: string
  email: string
}

export interface IUserAuthenticatedRepository {
  authenticateUser(params: AuthenticateUserParams): Promise<AuthenticateUserReturn>
}
