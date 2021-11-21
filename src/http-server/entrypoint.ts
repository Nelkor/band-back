import { RequestListener } from 'http'
import { parse } from 'querystring'

import { getToken, log } from '@/lib'
import { authorize } from '@/lib/authorization'
import { dispatch } from '@/lib/router'

import { createCommunication } from './responses'

const prefixLength = 5
const maxBodySize = 1024

export const requestListener: RequestListener = (req, res) => {
  const { headers, method, url } = req
  const { breakConnection, error, success } = createCommunication(req, res)

  if (!method || !url) {
    breakConnection()
    log(`invalid request: ${method} / ${url}`)

    return
  }

  const [pathString, queryString] = url.split('?')
  const params = parse(queryString)
  const token = getToken(headers.cookie)
  const userId = authorize(res, token)
  const bodyLength = +(headers['content-length'] || 0)
  const hasBody = method == 'POST' && bodyLength && bodyLength <= maxBodySize
  const body: Buffer[] | null = hasBody ? [] : null

  let bodySize = 0

  req.on('data', (chunk: Buffer) => {
    bodySize += chunk.length

    if (!body || bodySize > maxBodySize) {
      breakConnection()

      return
    }

    body.push(chunk)
  })

  req.on('end', () => {
    if (res.writableEnded) {
      return
    }

    const payload = {
      res,
      success,
      error,
      headers,
      params,
      userId,
      body: body ? Buffer.concat(body) : null,
    }

    dispatch(method, pathString.slice(prefixLength), payload).then(() =>
      res.end()
    )
  })
}
