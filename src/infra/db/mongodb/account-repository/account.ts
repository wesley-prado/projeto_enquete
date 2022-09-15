import { AddAccountRepository } from '../../../../data/protocols/add-account-repository-protocol'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account-protocol'
import { MongoHelper } from '../helpers/mongo-helper'

import utils from '../../../../utils/utils'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const dbAccount = utils.deepCopy(accountData)
    await accountCollection.insertOne(dbAccount)
    const account = MongoHelper.map(dbAccount)

    return await new Promise(resolve => resolve(account))
  }
}
