import app from '../config/app'
import * as request from 'supertest'

const routes = {
  SIGNUP: '/api/signup'
}

describe('Signup routes', () => {
  it('Should return an account on success', async () => {
    app.get(routes.SIGNUP, (req, res) => {
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
