import express = require('express')
import setupMiddlewares from './middlewares'

const app = express()
setupMiddlewares(app)

export default app
