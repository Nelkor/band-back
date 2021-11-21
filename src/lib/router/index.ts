import { RequestPayload, RequestHandler, ModuleRouter } from './types'

export { Errors } from './types'

export type { RequestHandler } from './types'

const getHandlers = new Map<string, RequestHandler>()
const postHandlers = new Map<string, RequestHandler>()

const createRouterErrorHandler =
  (message: string) =>
  ({ error }: RequestPayload) => {
    error(message)

    return Promise.resolve()
  }

const unknownPathHandler = createRouterErrorHandler('unknown path')
const unknownMethodHandler = createRouterErrorHandler('unknown method')

const dispatchGet = (path: string, payload: RequestPayload) => {
  const handler = getHandlers.get(path)

  return handler ? handler(payload) : unknownPathHandler(payload)
}

const dispatchPost = (path: string, payload: RequestPayload) => {
  const handler = postHandlers.get(path)

  return handler ? handler(payload) : unknownPathHandler(payload)
}

export const dispatch = async (
  method: string,
  path: string,
  payload: RequestPayload
): Promise<void> => {
  switch (method) {
    case 'GET':
      await dispatchGet(path, payload)

      break
    case 'POST':
      await dispatchPost(path, payload)

      break
    default:
      await unknownMethodHandler(payload)
  }
}

export const createModuleRouter = (moduleName: string): ModuleRouter => {
  const createMapSetter =
    (map: Map<string, RequestHandler>) =>
    (action: string, handler: RequestHandler) =>
      map.set([moduleName, action].join('/'), handler)

  return {
    get: createMapSetter(getHandlers),
    post: createMapSetter(postHandlers),
  }
}
