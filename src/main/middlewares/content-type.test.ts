import app from '../config/app'
import request = require('supertest')

const routes = {
  CONTENT_TYPE_JSON: '/test_content_type_JSON',
  CONTENT_TYPE_XML: '/test_content_type_XML'
}

describe('Content Type middleware', () => {
  it('Should return default content type as json', async () => {
    app.get(routes.CONTENT_TYPE_JSON, (req, res) => {
      res.status(200).send()
    })

    await request(app)
      .get(routes.CONTENT_TYPE_JSON)
      .expect('content-type', /json/)
  })

  it('Should return xml content type when forced', async () => {
    app.get(routes.CONTENT_TYPE_XML, (req, res) => {
      res.contentType('xml')
      res.status(200).send()
    })

    await request(app)
      .get(routes.CONTENT_TYPE_XML)
      .expect('content-type', /xml/)
  })
})
