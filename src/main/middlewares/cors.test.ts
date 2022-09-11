import app from '../config/app'
import * as request from 'supertest'

const routes = {
  CORS: '/test_cors'
}

describe('CORS middleware', () => {
  it('must allow all origin, header and methods', async () => {
    app.get(routes.CORS, (req, res) => {
      res.status(200).send()
    })

    await request(app)
      .get(routes.CORS)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
