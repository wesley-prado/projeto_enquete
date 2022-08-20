import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

const mockValues = {
  TEST_PASSWORD: 'any_password',
  TEST_EMAIL: 'any_email@mail.com',
  TEST_NAME: 'Any Name'
}

const makeSut = (): SignUpController => new SignUpController()

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    // system under test
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: mockValues.TEST_EMAIL,
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const sut = makeSut()
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
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        passwordConfirmation: mockValues.TEST_PASSWORD,
        email: mockValues.TEST_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        password: mockValues.TEST_PASSWORD,
        email: mockValues.TEST_EMAIL
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 200 all fields are provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: mockValues.TEST_NAME,
        email: mockValues.TEST_EMAIL,
        password: mockValues.TEST_PASSWORD,
        passwordConfirmation: mockValues.TEST_PASSWORD
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).not.toEqual(new MissingParamError('passwordConfirmation'))
  })
})
