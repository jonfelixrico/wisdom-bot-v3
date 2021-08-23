import { Module } from '@nestjs/common'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { PendingQuoteQueryService } from './pending-quote-query/pending-quote-query.service'
import { QuoteQueryService } from './quote-query/quote-query.service'
import { ReceiveQueryService } from './receive-query/receive-query.service'
import { GuildQueryHandlerService } from './handlers/guild-query-handler/guild-query-handler.service'
import { PendingQuoteQueryHandlerService } from './handlers/pending-quote-query-handler/pending-quote-query-handler.service'

const exportedModules = [
  QuoteQueryService,
  PendingQuoteQueryService,
  ReceiveQueryService,
]

@Module({
  imports: [TypeormModule],
  providers: [
    ...exportedModules,
    GuildQueryHandlerService,
    PendingQuoteQueryHandlerService,
  ],
  exports: exportedModules,
})
export class ReadModelQueryModule {}
