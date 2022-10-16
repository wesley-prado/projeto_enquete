import app from '../config/app'
import * as request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Response } from 'express'

const routes = {
  SIGNUP: '/api/signup'
}
// a
describe('Signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    app.post(routes.SIGNUP, (_, res: Response) => {
      res.status(200).send()
    })

    const account = {
      name: 'Wesley Prado',
      email: 'wesleyprado.dev@test.com',
      password: 'H3ll0 W0rld!',
      passwordConfirmation: 'H3ll0 W0rld!'
    }

    await request(app)
      .post(routes.SIGNUP)
      .send(account)
      .expect(200)
  })
})
