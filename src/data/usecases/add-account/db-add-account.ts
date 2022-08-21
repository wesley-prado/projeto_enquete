import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account-protocol'
import { AccountModel } from '../../../domain/models/account-model'
import { Encrypter } from '../../protocols/Encrypter-protocol'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({
      ...account,
      id: 'valid_id',
      password: hashedPassword
    }))
  }
}
