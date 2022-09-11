import app from '../config/app'
import request = require('supertest')

const routes = {
  BODY_PARSER: '/test_body_parser'
}

describe('Body parser middleware', () => {
  it('', async () => {
    app.post(routes.BODY_PARSER, (req, res) => {
      res.status(200).send(req.body)
    })

    const body = { name: 'Wesley Prado' }

    await request(app)
      .post(routes.BODY_PARSER)
      .send(body)
      .expect(body)
  })
})
