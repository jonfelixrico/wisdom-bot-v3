import { Module } from '@nestjs/common'
import { GuildRepository } from 'src/classes/guild-repository.abstract'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { QuoteRepository } from 'src/domain/quote/quote.repository'
import { ReceiveRepository } from 'src/domain/receive/receive.repository'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { GuildRepoImplService } from './deprecated/guild-repo-impl/guild-repo-impl.service'
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
  // TODO need to DDD-ify this
  {
    useClass: GuildRepoImplService,
    provide: GuildRepository,
  },
]

@Module({
  imports: [TypeormModule],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
