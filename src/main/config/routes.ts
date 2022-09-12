import { Express, Router } from 'express'
// import * as fg from 'fast-glob'
import * as fs from 'fs'
import * as path from 'node:path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesPath = path.join(__dirname, '../routes')

  fs.readdirSync(routesPath).filter(file => file.endsWith('-routes.ts')).map(async file => (await import(`${routesPath}/${file}`)).default(router))
}
