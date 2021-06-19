import { Module } from '@nestjs/common'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository/pending-quote-write-repository.service'
import { PendingQuoteEsdbRepository } from './abstract/pending-quote-esdb-repository.abstract'

@Module({
  providers: [
    {
      useClass: PendingQuoteWriteRepositoryService,
      provide: PendingQuoteEsdbRepository,
    },
  ],
})
export class WriteRepositoriesModule {}
