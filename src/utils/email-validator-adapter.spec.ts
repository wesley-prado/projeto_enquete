import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

const mock = {
  EMAIL: 'any_email@test.com'
}

describe('EmailValidator Adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(mock.EMAIL)

    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(mock.EMAIL)

    expect(isValid).toBe(true)
  })

  it('Should validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(mock.EMAIL)

    expect(isEmailSpy).toHaveBeenCalledWith(mock.EMAIL)
  })
})
