export interface User {
  id: number
  login: string
  email: string
  password: string
}

export interface AuthData {
  login: string | null
  email: string | null
  password: string | null
}

export interface LogOutData {
  mode: unknown
}

export enum AuthErrors {
  loginIsAlreadyTaken = 'login is already taken',
  emailIsAlreadyTaken = 'email is already taken',
  youAreAlreadyLoggedIn = 'you are already logged in',
  loginIsTooShort = 'login is too short',
}
