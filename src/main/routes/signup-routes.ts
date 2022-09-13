import { Router } from 'express'
import { signupControllerFactory } from '../factories/signup'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(signupControllerFactory()))
}
