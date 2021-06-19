import { Module } from '@nestjs/common'
import { QuoteWriteRepositoryService } from './quote-write-repository/quote-write-repository.service'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { ReceiveWriteRepositoryService } from './receive-write-repository/receive-write-repository.service'
import { PendingQuoteEsdbRepository } from './abstract/pending-quote-esdb-repository.abstract'

@Module({
  providers: [
    {
      useClass: PendingQuoteWriteRepositoryService,
      provide: PendingQuoteEsdbRepository,
    },
    QuoteWriteRepositoryService,
    ReceiveWriteRepositoryService,
  ],
})
export class WriteRepositoriesModule {}
