import { Encrypter } from '../../protocols/Encrypter-protocol'
import { DbAddAccount } from './db-add-account'

const mock = {
  account: {
    name: 'Valid Name',
    email: 'any_email@mail.com',
    password: 'ValidPassword@'
  }
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

interface SutTypes{
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(mock.account)

    expect(encryptSpy).toHaveBeenCalledWith(mock.account.password)
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const accountPromise = sut.add(mock.account)

    await expect(accountPromise).rejects.toThrow()
  })
})
