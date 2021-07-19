import { Logger } from '@nestjs/common'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { CatchUpFinishedEvent } from 'src/read-repositories/catch-up-finsihed.event'

export interface ICatchUpService {
  catchUp: () => Promise<void>
}

interface IRegisteredService {
  service: ICatchUpService
  sequence: number
}

@Injectable()
export class CatchUpOrchestratorService implements OnApplicationBootstrap {
  private services: IRegisteredService[] = []

  constructor(private logger: Logger, private eventBus: EventBus) {}

  register(service: ICatchUpService, sequence: number) {
    this.services.push({
      service,
      sequence,
    })
  }

  async onApplicationBootstrap() {
    const sortedServices = this.services.sort((a, b) => a.sequence - b.sequence)
    const { length } = sortedServices

    for (let idx = 0; idx < length; idx++) {
      const { service } = sortedServices[idx]
      try {
        await service.catchUp()
        this.logger.log(
          `Finished catch-up ${idx + 1} out of ${length}.`,
          CatchUpOrchestratorService.name,
        )
      } catch (e) {
        this.logger.error(
          `Uncaught exception while processing service ${
            idx + 1
          } out of ${length}: ${e.message}`,
          e.stack,
          CatchUpOrchestratorService.name,
        )
      }
    }

    this.eventBus.publish(new CatchUpFinishedEvent())
  }
}
