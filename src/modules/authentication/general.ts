import {
  RequestHandler,
  Errors,
  logOut,
  parseJson,
  hashPassword,
  addToAuthorized,
  getToken,
  stringOrNull,
} from '@/lib'

import {
  getUserById,
  addUser,
  setPasswordById,
  getUserByLogin,
  getUserByEmail,
} from './model'
import { MIN_LOGIN_LENGTH } from './constants'
import { LogOutData, AuthData, AuthErrors } from './types'

export const whoami: RequestHandler = async ({ userId, success }) => {
  if (!userId) {
    success({})

    return
  }

  const { id, login, email } = await getUserById(userId)

  success({ id, login, email })
}

export const quit: RequestHandler = ({
  res,
  success,
  error,
  body,
  userId,
  headers,
}) => {
  if (!userId) {
    error(Errors.youAreNotLoggedIn)

    return
  }

  if (!body) {
    error(Errors.bodyNeeded)

    return
  }

  const mode = String(parseJson<LogOutData>(body.toString()).mode)
  const token = getToken(headers.cookie)

  if (mode != 'all' && mode != 'this' && mode != 'others') {
    error('unknown mode')

    return
  }

  logOut(res, userId, token, mode)
  success()
}

const getAuthData = (userId: number, body: Buffer | null): AuthData => {
  if (!body) {
    throw new Error(Errors.bodyNeeded)
  }

  if (userId) {
    throw new Error(AuthErrors.youAreAlreadyLoggedIn)
  }

  const authData = parseJson<AuthData>(body.toString())
  const login = stringOrNull(authData.login)
  const email = stringOrNull(authData.email)
  const password = stringOrNull(authData.password)

  return { login, email, password }
}

export const reg: RequestHandler = async ({
  res,
  success,
  error,
  userId,
  body,
}) => {
  try {
    const { password, login, email } = getAuthData(userId, body)

    if (!password || (!login && !email)) {
      error(Errors.notEnoughData)

      return
    }

    if (login) {
      if (login.length < MIN_LOGIN_LENGTH) {
        error(AuthErrors.loginIsTooShort)

        return
      }

      if (await getUserByLogin(login)) {
        error(AuthErrors.loginIsAlreadyTaken)

        return
      }
    }

    if (email && (await getUserByEmail(email))) {
      error(AuthErrors.emailIsAlreadyTaken)

      return
    }

    const id = await addUser(login, email)

    const hash = hashPassword(id, password)

    await setPasswordById(id, hash)

    addToAuthorized(res, id)

    success({ id })
  } catch (e) {
    error((e as Error).message)
  }
}

export const enter: RequestHandler = async ({
  res,
  success,
  error,
  userId,
  body,
}) => {
  try {
    const { password, login } = getAuthData(userId, body)

    if (!password || !login) {
      error(Errors.notEnoughData)

      return
    }

    const user = (await getUserByLogin(login)) || (await getUserByEmail(login))

    if (!user) {
      error('no such a user')

      return
    }

    const { id, email } = user
    const hash = hashPassword(id, password)

    if (hash != user.password) {
      error('incorrect password')

      return
    }

    addToAuthorized(res, id)

    success({ id, email, login: user.login })
  } catch (e) {
    error((e as Error).message)
  }
}
