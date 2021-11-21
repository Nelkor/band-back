import { RequestHandler, Errors } from '@/lib'
import { getUserByEmail, getUserByLogin } from '@/modules/authentication/model'

import passwords from './passwords.txt'

const badPasswords = passwords.split(';')

export const checkLogin: RequestHandler = async ({
  params,
  error,
  success,
}) => {
  const { login } = params

  if (typeof login != 'string') {
    error(Errors.notEnoughData)

    return
  }

  const loginIsFree = !(await getUserByLogin(login))

  success({ loginIsFree })
}

export const checkEmail: RequestHandler = async ({
  params,
  error,
  success,
}) => {
  const { email } = params

  if (typeof email != 'string') {
    error(Errors.notEnoughData)

    return
  }

  const emailIsFree = !(await getUserByEmail(email))

  success({ emailIsFree })
}

export const checkPassword: RequestHandler = ({ params, error, success }) => {
  const { password } = params

  if (typeof password != 'string') {
    error(Errors.notEnoughData)

    return
  }

  const isPasswordGood = !badPasswords.includes(password)

  success({ isPasswordGood })
}
