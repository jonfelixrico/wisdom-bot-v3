import { Module } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { PendingQuoteEsdbRepository } from './abstract/pending-quote-esdb-repository.abstract'
import { DomainEventPublisherService } from './domain-event-publisher/domain-event-publisher.service'
import { EventStoreModule } from 'src/event-store/event-store.module'

const providersToExport = [
  {
    useClass: PendingQuoteWriteRepositoryService,
    provide: PendingQuoteEsdbRepository,
  },
]

@Module({
  providers: [...providersToExport, DomainEventPublisherService],
  imports: [EventStoreModule],
  exports: [...providersToExport],
})
export class WriteRepositoriesModule {}
