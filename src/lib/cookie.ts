import { ServerResponse } from 'http'

const zeroUtc = new Date(0).toUTCString()

const createCookieParser = (regExp: RegExp) => (cookie?: string) => {
  if (!cookie) {
    return ''
  }

  const match = regExp.exec(cookie)

  return match ? match[1] : ''
}

export const getToken = createCookieParser(/token=(\w+)/)

export const setToken = (res: ServerResponse, token: string): void => {
  const value = [
    `token=${token}`,
    'SameSite=Strict',
    'Path=/',
    'HttpOnly',
    'Secure',
  ].join('; ')

  res.setHeader('Set-cookie', value)
}

export const unsetToken = (res: ServerResponse): void => {
  res.setHeader('Set-cookie', `token=deleted; Path=/; Expires=${zeroUtc}`)
}
