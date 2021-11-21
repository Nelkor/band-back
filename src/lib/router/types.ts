import { ParsedUrlQuery } from 'querystring'
import { IncomingHttpHeaders, ServerResponse } from 'http'

type SuccessfulResponse = (data?: unknown) => void
type ErrorResponse = (reason: string) => void

export interface Communication {
  breakConnection(): void
  success: SuccessfulResponse
  error: ErrorResponse
}

export interface RequestPayload {
  res: ServerResponse
  params: ParsedUrlQuery
  headers: IncomingHttpHeaders
  userId: number
  success: SuccessfulResponse
  error: ErrorResponse
  body: Buffer | null
}

export type RequestHandler = (payload: RequestPayload) => Promise<void> | void

type HandlerRegistrar = (action: string, handler: RequestHandler) => void

export interface ModuleRouter {
  get: HandlerRegistrar
  post: HandlerRegistrar
}

export enum Errors {
  youAreNotLoggedIn = 'you are not logged in',
  bodyNeeded = 'body needed',
  notEnoughData = 'not enough data',
}
