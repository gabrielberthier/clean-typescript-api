import { HttpResponse } from '../../protocols'
import { ServerError, UnauthorizedError } from '../../errors'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = function (error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error)
  }
}

export const unauthorized = function (): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export const responseOK = function (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}

export const forbidden = function (error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: error
  }
}

export const noContent = function (): HttpResponse {
  return {
    statusCode: 204,
    body: null
  }
}
