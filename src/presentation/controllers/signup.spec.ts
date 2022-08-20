import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../interfaces'

const mockValues = {
  TEST_VALID_PASSWORD: 'valid_password',
  TEST_INVALID_PASSWORD: 'invalid_password',
  TEST_VALID_EMAIL: 'valid_email@mail.com',
  TEST_INVALID_EMAIL: 'invalid_email@mail.com',
  TEST_NAME: 'Any Name'
}

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    // system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: mockValues.TEST_VALID_EMAIL,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD,
        email: mockValues.TEST_VALID_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        email: mockValues.TEST_VALID_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD,
        email: mockValues.TEST_INVALID_EMAIL
      }
    }

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 400 if an password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_INVALID_PASSWORD,
        email: mockValues.TEST_VALID_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD,
        email: mockValues.TEST_VALID_EMAIL
      }
    }

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(mockValues.TEST_VALID_EMAIL)
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD,
        email: mockValues.TEST_INVALID_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 all fields are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        email: mockValues.TEST_VALID_EMAIL,
        password: mockValues.TEST_VALID_PASSWORD,
        passwordConfirmation: mockValues.TEST_VALID_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).not.toEqual(new MissingParamError('passwordConfirmation'))
  })
})
