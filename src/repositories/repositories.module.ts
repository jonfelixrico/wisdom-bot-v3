import { Module } from '@nestjs/common'
import { ReceiveRepoImplService } from './deprecated/receive-repo-impl/receive-repo-impl.service'
import { QuoteRepoImplService } from './deprecated/quote-repo-impl/quote-repo-impl.service'
import { ConcurRepoImplService } from './deprecated/concur-repo-impl/concur-repo-impl.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { ConcurRepository } from 'src/classes/concur-repository.abstract'
import { GuildRepoImplService } from './deprecated/guild-repo-impl/guild-repo-impl.service'
import { GuildRepository } from 'src/classes/guild-repository.abstract'
import { PendingQuoteRepoImplService } from './deprecated/pending-quote-repo-impl/pending-quote-repo-impl.service'
import { PendingQuoteRepository } from 'src/classes/pending-quote-repository.abstract'
import { StatsRepoImplService } from './deprecated/stats-repo-impl/stats-repo-impl.service'
import { StatsRepository } from 'src/classes/stats-repository.abstract'

const providers = [
  {
    useClass: ReceiveRepoImplService,
    provide: ReceiveRepository,
  },
  {
    useClass: QuoteRepoImplService,
    provide: QuoteRepository,
  },
  {
    useClass: ConcurRepoImplService,
    provide: ConcurRepository,
  },
  {
    useClass: GuildRepoImplService,
    provide: GuildRepository,
  },
  {
    useClass: PendingQuoteRepoImplService,
    provide: PendingQuoteRepository,
  },
  {
    useClass: StatsRepoImplService,
    provide: StatsRepository,
  },
]

@Module({
  imports: [TypeormModule],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
