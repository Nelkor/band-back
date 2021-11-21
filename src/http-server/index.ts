import { createServer } from 'http'

import { requestListener } from './entrypoint'

const port = 9001

export const startListening = (): void => {
  createServer(requestListener).listen(port)
}
