import { createModuleRouter } from '@/lib/router'

import { whoami, quit, reg, enter } from './general'
import { checkLogin, checkEmail, checkPassword } from './checks'
import { changeLogin, changePassword } from './changes'

const { get, post } = createModuleRouter('auth')

export const addAuthentication = (): void => {
  get('whoami', whoami)
  get('check-login', checkLogin)
  get('check-email', checkEmail)
  get('check-password', checkPassword)

  post('quit', quit)
  post('reg', reg)
  post('enter', enter)
  post('change-login', changeLogin)
  post('change-password', changePassword)
}
