import { Module } from '@nestjs/common'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { QuoteRepository } from 'src/domain/quote/quote.repository'
import { ReceiveRepository } from 'src/domain/receive/receive.repository'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { PendingQuoteRepositoryService } from './pending-quote-repository/pending-quote-repository.service'
import { QuoteRepositoryService } from './quote-repository/quote-repository.service'
import { ReceiveRepositoryService } from './receive-repository/receive-repository.service'

const providers = [
  {
    useClass: PendingQuoteRepositoryService,
    provide: PendingQuoteRepository,
  },
  {
    useClass: QuoteRepositoryService,
    provide: QuoteRepository,
  },
  {
    useClass: ReceiveRepositoryService,
    provide: ReceiveRepository,
  },
]

@Module({
  imports: [TypeormModule],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
