import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../interfaces'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { AddAccount } from '../../domain/usecases/add-account-interface'

const REQUIRED_FIELDS = ['name', 'email', 'password', 'passwordConfirmation']

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      for (const field of REQUIRED_FIELDS) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email, password, passwordConfirmation, name } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      this.addAccount.add({
        email,
        name,
        password
      })

      return {
        statusCode: 200,
        body: 'OK'
      }
    } catch (error) {
      return serverError()
    }
  }
}
