import { Module, Provider } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { ReadStreamService } from './read-stream/read-stream.service'
import { QuoteWriteRepositoryService } from './quote-write-repository/quote-write-repository.service'
import { ReceiveWriteRepositoryService } from './receive-write-repository/receive-write-repository.service'
import { PendingQuoteWriteRepository } from './abstract/pending-quote-write-repository.abstract'
import { QuoteWriteRepository } from './abstract/quote-write-repository.abstract'
import { ReceiveWriteRepository } from './abstract/receive-write-repository.abstract'

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
]

@Module({
  providers: [...providersToExport, ReadStreamService],
  imports: [EventStoreModule],
  exports: providersToExport,
})
export class WriteRepositoriesModule {}
