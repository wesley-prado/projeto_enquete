import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (newAccount: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(newAccount.password)
    const account = await this.addAccountRepository.add({
      ...newAccount,
      password: hashedPassword
    })

    return account
  }
}
