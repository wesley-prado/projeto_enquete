import { Router, Response } from 'express'

export default (router: Router): void => {
  router.post('/signup', (_, res: Response) => {
    res.json({ ok: true })
  })
}
