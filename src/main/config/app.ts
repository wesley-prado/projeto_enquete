import express = require('express')
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()

setupMiddlewares(app)
setupRoutes(app)

export default app
