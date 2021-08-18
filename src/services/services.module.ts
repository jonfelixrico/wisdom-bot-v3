import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { MessageRecacheService } from './message-recache/message-recache.service'

@Module({
  imports: [ReadModelQueryModule, DiscordModule],
  // TODO check out why MessageRecacheService fails
  // providers: [MessageRecacheService],
})
export class ServicesModule {}
