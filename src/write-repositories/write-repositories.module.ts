import { Module, Provider } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { QuoteWriteRepositoryService } from './quote-write-repository/quote-write-repository.service'
import { ReceiveWriteRepositoryService } from './receive-write-repository/receive-write-repository.service'
import { PendingQuoteWriteRepository } from './abstract/pending-quote-write-repository.abstract'
import { QuoteWriteRepository } from './abstract/quote-write-repository.abstract'
import { ReceiveWriteRepository } from './abstract/receive-write-repository.abstract'
import { DomainEventPublisherService } from './domain-event-publisher/domain-event-publisher.service'
import { EsdbHelperService } from './esdb-helper/esdb-helper.service'
import { GuildWriteRepositoryService } from './guild-write-repository/guild-write-repository.service'
import { GuildWriteRepository } from './abstract/guild-write-repository.abstract'

const providersToExport: Provider[] = [
  {
    provide: PendingQuoteWriteRepository,
    useClass: PendingQuoteWriteRepositoryService,
  },
  {
    provide: QuoteWriteRepository,
    useClass: QuoteWriteRepositoryService,
  },
  {
    provide: ReceiveWriteRepository,
    useClass: ReceiveWriteRepositoryService,
  },
  {
    provide: GuildWriteRepository,
    useClass: GuildWriteRepositoryService,
  },
]

@Module({
  providers: [
    ...providersToExport,
    DomainEventPublisherService,
    EsdbHelperService,
  ],
  imports: [EventStoreModule],
  exports: providersToExport,
})
export class WriteRepositoriesModule {}
