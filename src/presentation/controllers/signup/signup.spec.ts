import { SignUpController } from './signup'
import { AddAccount, AddAccountModel, AccountModel, EmailValidator, HttpRequest } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { success, badRequest, serverError } from '../../helpers/http-helper'

const mock = {
  TEST_VALID_PASSWORD: 'valid_password',
  TEST_INVALID_PASSWORD: 'invalid_password',
  TEST_VALID_EMAIL: 'valid_email@mail.com',
  TEST_INVALID_EMAIL: 'invalid_email@mail.com',
  TEST_NAME: 'Any Name',
  ID: 'any_id',
  ERROR_MESSAGE: 'An Exception has occurred.'
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: mock.ID,
        name: mock.TEST_NAME,
        email: mock.TEST_VALID_EMAIL,
        password: mock.TEST_VALID_PASSWORD
      }

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: mock.ID,
  name: mock.TEST_NAME,
  password: mock.TEST_VALID_PASSWORD,
  email: mock.TEST_VALID_EMAIL
})

const makeFakeRequest = (removeField?: string): HttpRequest => {
  const httpRequest: HttpRequest = {
    body: {
      name: mock.TEST_NAME,
      password: mock.TEST_VALID_PASSWORD,
      passwordConfirmation: mock.TEST_VALID_PASSWORD,
      email: mock.TEST_VALID_EMAIL
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  if (removeField && removeField in httpRequest.body) delete httpRequest.body[removeField]

  return httpRequest
}

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    // system under test
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest('name'))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest('email'))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest('password'))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest('passwordConfirmation'))

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.email = mock.TEST_INVALID_EMAIL

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 400 if an password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.passwordConfirmation = mock.TEST_INVALID_PASSWORD
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith(mock.TEST_VALID_EMAIL)
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error(mock.ERROR_MESSAGE)
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('Internal Server Error')))
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error(mock.ERROR_MESSAGE))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('Internal Server Error')))
  })

  it('Should return 200 all fields are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).not.toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: mock.TEST_NAME,
      password: mock.TEST_VALID_PASSWORD,
      email: mock.TEST_VALID_EMAIL
    })
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(success(makeFakeAccount()))
  })
})
