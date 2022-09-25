import { SignUpController } from './signup'
import { AddAccount, AddAccountModel, AccountModel, EmailValidator } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

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
    const httpRequest = {
      body: {
        email: mock.TEST_VALID_EMAIL,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_VALID_EMAIL
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_VALID_EMAIL
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_INVALID_EMAIL
      }
    }

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 400 if an password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_INVALID_PASSWORD,
        email: mock.TEST_VALID_EMAIL
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_VALID_EMAIL
      }
    }

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(mock.TEST_VALID_EMAIL)
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error(mock.ERROR_MESSAGE)
    })

    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_INVALID_EMAIL
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(mock.ERROR_MESSAGE))
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error(mock.ERROR_MESSAGE))
    })

    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_INVALID_EMAIL
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(mock.ERROR_MESSAGE))
  })

  it('Should return 200 all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        email: mock.TEST_VALID_EMAIL,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).not.toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: mock.TEST_NAME,
        password: mock.TEST_VALID_PASSWORD,
        passwordConfirmation: mock.TEST_VALID_PASSWORD,
        email: mock.TEST_VALID_EMAIL
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: mock.TEST_NAME,
      password: mock.TEST_VALID_PASSWORD,
      email: mock.TEST_VALID_EMAIL
    })
  })
})
