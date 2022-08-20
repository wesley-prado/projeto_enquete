import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../interfaces'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'

const REQUIRED_FIELDS = ['name', 'email', 'password', 'passwordConfirmation']

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      for (const field of REQUIRED_FIELDS) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email, password, passwordConfirmation } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      return {
        statusCode: 200,
        body: 'OK'
      }
    } catch (error) {
      return serverError()
    }
  }
}
