import { ServerResponse } from 'http'

import { setToken, unsetToken } from '@/lib'

import { tokenLifetime, createToken, parseToken } from './token'
import { usersTokens } from './users-tokens'

const tokenRenewLimit = tokenLifetime - 1000 * 60 * 60 * 2
const devicesCountLimit = 4

export const authorize = (res: ServerResponse, token: string): number => {
  if (!token) {
    return 0
  }

  const now = Date.now()
  const { id, expires } = parseToken(token)
  const userTokens = usersTokens.get(id)

  if (!userTokens || expires < now || !userTokens.includes(token)) {
    unsetToken(res)

    return 0
  }

  if (expires - now < tokenRenewLimit) {
    const newToken = createToken(id)
    const index = userTokens.indexOf(token)

    userTokens.splice(index, 1)
    userTokens.push(newToken)

    setToken(res, newToken)
  }

  return id
}

export const logOut = (
  res: ServerResponse,
  userId: number,
  token: string,
  mode: 'this' | 'all' | 'others'
): void => {
  const tokens = usersTokens.get(userId)

  if (!tokens) {
    return
  }

  const tokenIndex = tokens.indexOf(token)

  switch (mode) {
    case 'this':
      tokens.splice(tokenIndex, 1)

      unsetToken(res)

      break
    case 'all':
      usersTokens.delete(userId)

      unsetToken(res)

      break
    case 'others':
      tokens.length = 0
      tokens.push(token)

      break
  }
}

export const addToAuthorized = (res: ServerResponse, userId: number): void => {
  const tokens = usersTokens.get(userId) || []
  const token = createToken(userId)

  tokens.push(token)

  while (tokens.length > devicesCountLimit) {
    tokens.shift()
  }

  usersTokens.set(userId, tokens)

  setToken(res, token)
}
