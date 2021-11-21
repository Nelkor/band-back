import { queryData, queryAction } from '@/lib'

import { User } from './types'
import userById from './queries/user-by-id.sql'
import insertUser from './queries/insert-user.sql'
import updatePasswordById from './queries/update-password-by-id.sql'
import userByLogin from './queries/user-by-login.sql'
import userByEmail from './queries/user-by-email.sql'
import updateLogin from './queries/update-login.sql'

export const getUserById = async (id: number): Promise<User> => {
  const [user] = await queryData<User>(userById, [id])

  return user
}

const getUserByParam = async (query: string, param: string) => {
  const [user] = await queryData<User>(query, [param])

  return user
}

export const getUserByLogin = (login: string): Promise<User | undefined> =>
  getUserByParam(userByLogin, login)

export const getUserByEmail = (email: string): Promise<User | undefined> =>
  getUserByParam(userByEmail, email)

export const addUser = async (
  login: string | null = null,
  email: string | null = null
): Promise<number> => {
  const values = [login, email]

  const result = await queryAction(insertUser, values)

  return result.insertId
}

export const setPasswordById = async (
  id: number,
  password: string
): Promise<void> => {
  const values = [password, id]

  await queryAction(updatePasswordById, values)
}

export const setLoginById = async (
  id: number,
  login: string
): Promise<void> => {
  const values = [login, id]

  await queryAction(updateLogin, values)
}
