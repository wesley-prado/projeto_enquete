import { DbAddAccount } from './db-add-account'

const mock = {
  VALID_NAME: 'Valid Name',
  VALID_EMAIL: 'any_email@mail.com',
  VALID_PASSWORD: 'ValidPassword@'
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (password: string): Promise<string> {
        return await Promise.resolve('hashed_password')
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: mock.VALID_NAME,
      email: mock.VALID_EMAIL,
      password: mock.VALID_PASSWORD
    }
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(mock.VALID_PASSWORD)
  })
})
