import { IncomingMessage, ServerResponse } from 'http'

import { Communication } from '@/lib/router/types'

const forbid = (res: ServerResponse): void => {
  res.statusCode = 403
  res.statusMessage = 'Forbidden'

  res.end()
}

export const createCommunication = (
  req: IncomingMessage,
  res: ServerResponse
): Communication => ({
  breakConnection() {
    forbid(res)

    req.destroy()
  },
  success(data?: unknown) {
    res.write(JSON.stringify({ success: true, data }))
  },
  error(reason: string) {
    res.write(JSON.stringify({ success: false, reason }))
  },
})
