import * as Buffer from 'buffer'

import { RequestHandler, Errors, parseJson, hashPassword } from '@/lib'

import { MIN_LOGIN_LENGTH } from './constants'
import { AuthErrors } from './types'
import { getUserByLogin, setLoginById, setPasswordById } from './model'

interface ChangeData {
  value: string
}

const getValue = (userId: number, body: Buffer | null): string => {
  if (!userId) {
    throw new Error(Errors.youAreNotLoggedIn)
  }

  if (!body) {
    throw new Error(Errors.bodyNeeded)
  }

  const value = String(parseJson<ChangeData>(body.toString()).value)

  if (!value) {
    throw new Error(Errors.notEnoughData)
  }

  return value
}

export const changeLogin: RequestHandler = async ({
  userId,
  error,
  success,
  body,
}) => {
  try {
    const login = getValue(userId, body)

    if (login.length < MIN_LOGIN_LENGTH) {
      error(AuthErrors.loginIsTooShort)

      return
    }

    if (await getUserByLogin(login)) {
      error(AuthErrors.loginIsAlreadyTaken)

      return
    }

    await setLoginById(userId, login)

    success()
  } catch (e) {
    error((e as Error).message)
  }
}

export const changePassword: RequestHandler = async ({
  userId,
  error,
  success,
  body,
}) => {
  try {
    const password = getValue(userId, body)

    await setPasswordById(userId, hashPassword(userId, password))

    success()
  } catch (e) {
    error((e as Error).message)
  }
}
