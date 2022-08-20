import { Controller } from '../interfaces/controller-interface'
import { HttpRequest, HttpResponse } from '../interfaces/http-interface'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helper'
import { EmailValidator } from '../interfaces/email-validator-interface'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }

    const { email } = httpRequest.body

    if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

    return {
      statusCode: 200,
      body: 'OK'
    }
  }
}
