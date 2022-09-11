import { AddAccountRepository } from '../../../../data/protocols/add-account-repository-protocol'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account-protocol'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const dbAccount = JSON.parse(JSON.stringify(accountData))
    await accountCollection.insertOne(dbAccount)
    const account = MongoHelper.map(dbAccount)

    return await new Promise(resolve => resolve(account))
  }
}
