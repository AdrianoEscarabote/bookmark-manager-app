export interface AuthenticateUserParams {
  token: string
}

export interface AuthenticateUserReturn {
  success: boolean
}

export interface IUserAuthenticatedRepository {
  authenticateUser(params: AuthenticateUserParams): Promise<AuthenticateUserReturn>
}
