import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { MessageRecacheService } from './message-recache/message-recache.service'

@Module({
  imports: [ReadModelQueryModule, CqrsModule, DiscordModule],
  providers: [MessageRecacheService],
})
export class ServicesModule {}
