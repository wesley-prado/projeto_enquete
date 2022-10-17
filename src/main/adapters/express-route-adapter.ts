import { Request, Response } from 'express'
import { isSuccessfullStatusCode } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)
    if (isSuccessfullStatusCode(httpResponse.statusCode)) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json(
        {
          error: httpResponse.body.message
        }
      )
    }
  }
}
