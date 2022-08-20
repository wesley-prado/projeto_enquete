import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../interfaces/email-validator-interface'

const mockValues = {
  TEST_PASSWORD: 'any_password',
  TEST_VALID_EMAIL: 'valid_email@mail.com',
  TEST_INVALID_EMAIL: 'invalid_email@mail.com',
  TEST_NAME: 'Any Name'
}

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
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
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD
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
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD
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
        passwordConfirmation: mockValues.TEST_PASSWORD,
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
        password: mockValues.TEST_PASSWORD,
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
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD,
        email: mockValues.TEST_INVALID_EMAIL
      }
    }

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 200 all fields are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        email: mockValues.TEST_VALID_EMAIL,
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).not.toEqual(new MissingParamError('passwordConfirmation'))
  })
})
