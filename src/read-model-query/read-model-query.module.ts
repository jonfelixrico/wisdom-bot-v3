import { Module } from '@nestjs/common'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { GuildStatsQueryService } from './guild-stats-query/guild-stats-query.service'
import { PendingQuoteQueryService } from './pending-quote-query/pending-quote-query.service'
import { QuoteQueryService } from './quote-query/quote-query.service'
import { ReceiveQueryService } from './receive-query/receive-query.service'
import { UserStatsQueryService } from './user-stats-query/user-stats-query.service'

const exportedModules = [
  QuoteQueryService,
  PendingQuoteQueryService,
  GuildStatsQueryService,
  UserStatsQueryService,
  ReceiveQueryService,
]

@Module({
  imports: [TypeormModule],
  providers: [...exportedModules],
  exports: exportedModules,
})
export class ReadModelQueryModule {}
