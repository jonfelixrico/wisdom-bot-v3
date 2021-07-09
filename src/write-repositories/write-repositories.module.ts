import { Module } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { ReadStreamService } from './read-stream/read-stream.service'

const providersToExport = [PendingQuoteWriteRepositoryService]

@Module({
  providers: [...providersToExport, ReadStreamService],
  imports: [EventStoreModule],
  exports: providersToExport,
})
export class WriteRepositoriesModule {}
