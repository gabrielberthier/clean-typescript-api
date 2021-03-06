import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logger: LogErrorRepository

  constructor (controller: Controller, logger: LogErrorRepository) {
    this.controller = controller
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logger.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
