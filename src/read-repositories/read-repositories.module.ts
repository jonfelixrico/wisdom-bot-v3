import { Module } from '@nestjs/common'
import { QuoteCatchUpService } from './quote-catch-up/quote-catch-up.service'

@Module({
  providers: [QuoteCatchUpService],
})
export class ReadRepositoriesModule {}
