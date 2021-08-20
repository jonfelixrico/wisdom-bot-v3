import { Module } from '@nestjs/common'
import { dbProvider } from './providers/db.provider'

@Module({
  providers: [dbProvider],
})
export class QuoteExpirationModule {}
