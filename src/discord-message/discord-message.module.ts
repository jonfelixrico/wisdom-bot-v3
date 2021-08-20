import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'

@Module({
  providers: [dbProvider],
})
export class DiscordMessageModule {}
