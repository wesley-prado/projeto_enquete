import { Encrypter } from '../../protocols/Encrypter-protocol'
import { DbAddAccount } from './db-add-account'

const mock = {
  account: {
    name: 'Valid Name',
    email: 'any_email@mail.com',
    password: 'ValidPassword@'
  }
}
interface SutTypes{
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
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
})
