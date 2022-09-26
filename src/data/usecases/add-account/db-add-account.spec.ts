import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const mock = {
  HASHED_PASSWORD: 'hashed_password',
  ID: 'valid_id'
}

const makeFakeAccount = (): AddAccountModel => ({
  name: 'Valid Name',
  email: 'any_email@mail.com',
  password: 'ValidPassword@'
})

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await Promise.resolve(mock.HASHED_PASSWORD)
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: mock.ID,
        ...makeFakeAccount(),
        password: mock.HASHED_PASSWORD
      }

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

interface SutTypes{
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = makeFakeAccount()
    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith(account.password)
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const accountPromise = sut.add(makeFakeAccount())
    await expect(accountPromise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccount())

    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeAccount(),
      password: mock.HASHED_PASSWORD
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const accountPromise = sut.add(makeFakeAccount())
    await expect(accountPromise).rejects.toThrow()
  })

  it('Should return an Account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccount())

    expect(account).toEqual({
      ...makeFakeAccount(),
      id: mock.ID,
      password: mock.HASHED_PASSWORD
    })
  })
})
