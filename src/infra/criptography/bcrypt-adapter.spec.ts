/* eslint-disable @typescript-eslint/no-misused-promises */
import * as bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const SALT = 12

const mock = {
  HASHED_PASS: 'hashed_pass'
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve(mock.HASHED_PASS)
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT)
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe(mock.HASHED_PASS)
  })

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
      return await Promise.reject(new Error())
    })
    const hashPromise = sut.encrypt('any_value')

    await expect(hashPromise).rejects.toThrowError()
  })
})
