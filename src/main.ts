import { startListening } from '@/http-server'
import { log } from '@/lib/log'

import { addModules } from './modules-registrar'

process.on('SIGTERM', () => {
  log('application has been stopped')

  process.exit(0)
})

addModules()
startListening()

log('application has started')
