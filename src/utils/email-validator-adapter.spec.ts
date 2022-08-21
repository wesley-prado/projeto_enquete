import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

const mock = {
  EMAIL: 'any_email@test.com'
}

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(mock.EMAIL)

    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid(mock.EMAIL)

    expect(isValid).toBe(true)
  })

  it('Should validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(mock.EMAIL)

    expect(isEmailSpy).toHaveBeenCalledWith(mock.EMAIL)
  })
})
