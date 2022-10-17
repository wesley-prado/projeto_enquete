import { HttpResponse } from '../protocols/http-protocol'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack ?? 'An unknown exception occurred')
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const isSuccessfullStatusCode = (statusCode: number): boolean => statusCode >= 200 && statusCode <= 299
