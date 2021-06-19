import { Module } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { PendingQuoteEsdbRepository } from './abstract/pending-quote-esdb-repository.abstract'
import { DomainEventPublisherService } from './domain-event-publisher/domain-event-publisher.service'

@Module({
  providers: [
    {
      useClass: PendingQuoteWriteRepositoryService,
      provide: PendingQuoteEsdbRepository,
    },
    DomainEventPublisherService,
  ],
})
export class WriteRepositoriesModule {}
