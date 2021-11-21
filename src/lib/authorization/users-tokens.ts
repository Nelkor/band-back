import { parseToken } from './token'

export const usersTokens: Map<number, string[]> = new Map()

const expirationCheckInterval = 1000 * 60 * 10

const expirationCheck = () => {
  const now = Date.now()

  usersTokens.forEach((tokens, key) => {
    const aliveTokens = tokens.filter(token => {
      const { expires } = parseToken(token)

      return now < expires
    })

    if (tokens.length == aliveTokens.length) {
      return
    }

    if (!aliveTokens.length) {
      usersTokens.delete(key)

      return
    }

    usersTokens.set(key, aliveTokens)
  })
}

setInterval(expirationCheck, expirationCheckInterval)
