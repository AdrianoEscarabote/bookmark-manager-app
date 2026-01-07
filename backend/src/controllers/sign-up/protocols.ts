export interface SignUpParams {
  name: string
  email: string
  password: string
}

export interface SignUpReturnTypes {
  name: string
  email: string
  id: string
}

export interface ISignUpRepository {
  signUp(params: SignUpParams): Promise<SignUpReturnTypes>
}
