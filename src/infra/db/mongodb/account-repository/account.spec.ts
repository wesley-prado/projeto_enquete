import { MongoHelper } from '../helpers/mongo-helper'

const mockValues = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

const makeSut = () => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
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
