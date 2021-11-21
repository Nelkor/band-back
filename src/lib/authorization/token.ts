interface TokenData {
  id: number
  expires: number
}

export const tokenLifetime = 1000 * 60 * 60 * 24 * 2

export const createToken = (id: number): string => {
  const secret = Array.from({ length: 6 })
    .map(() => Math.random().toString(36).slice(2))
    .reduce<string[]>((acc, cur) => [...acc, ...cur], [])
    .map(char => (Math.random() < 0.5 ? char.toUpperCase() : char))
    .join('')

  return `${id}_${secret}_${Date.now() + tokenLifetime}`
}

export const parseToken = (token: string): TokenData => {
  const result = { id: 0, expires: 0 }
  const parts = token.split('_')

  if (parts.length != 3) {
    return result
  }

  const [id, , expires] = parts

  result.id = +id
  result.expires = +expires

  return result
}
