export interface SignInParams {
  email: string
  password: string
}

export interface SignInReturnTypes {
  id: string
}

export interface ISignInRepository {
  signIn(params: SignInParams): Promise<SignInReturnTypes>
}
