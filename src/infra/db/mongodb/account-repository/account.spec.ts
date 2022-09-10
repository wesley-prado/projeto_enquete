import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const mockValues = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add(mockValues)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(mockValues.name)
    expect(account.email).toBe(mockValues.email)
    expect(account.password).toBe(mockValues.password)
  })
})
