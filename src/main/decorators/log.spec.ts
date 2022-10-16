import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError, success } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository-protocol'
import { AccountModel } from '../../domain/models/account-model'
import { ServerError } from '../../presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Wesley',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    email: 'wesley.dev@mail.com'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'Any_Id',
  name: 'Wesley',
  password: 'any_password',
  email: 'any_password'
})

const makeFakeServerError = (stackMessage: string = ''): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = stackMessage
  return serverError(new ServerError(fakeError.stack))
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(success(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

interface MakeSutType {
  sut: Controller
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): MakeSutType => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(success(makeFakeAccount()))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError('any stack message')))

    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any stack message')
  })
})
