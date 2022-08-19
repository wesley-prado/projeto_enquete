import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  const mockValues = {
    TEST_PASSWORD: 'any_password',
    TEST_EMAIL: 'wesley@test.com',
    TEST_NAME: 'Wesley Prado'
  }

  it('Should return 400 if no name is provided', () => {
    // system under test
    const sut = new SignUpController()
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
    // system under test
    const sut = new SignUpController()
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
})
