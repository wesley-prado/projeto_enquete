import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface MakeSutType {
  sut: Controller
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: httpRequest.body,
        statusCode: 200
      }

      return await Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const makeSut = (): MakeSutType => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'Wesley Prado',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'Wesley Prado',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: httpRequest.body
    })
  })
})
