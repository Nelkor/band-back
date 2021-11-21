import { createHash } from 'crypto'

const hashString = (str: string): string =>
  createHash('sha1').update(str).digest('hex')

export const hashPassword = (userId: number, password: string): string =>
  hashString(`${userId}${password}`)
