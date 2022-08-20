import { Controller } from '../interfaces/controller-interface'
import { HttpRequest, HttpResponse } from '../interfaces/http-interface'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../interfaces/email-validator-interface'

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

      const { email } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

      return {
        statusCode: 200,
        body: 'OK'
      }
    } catch (error) {
      return serverError()
    }
  }
}
