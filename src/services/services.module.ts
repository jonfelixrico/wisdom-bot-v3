import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelCatchUpModule } from 'src/read-model-catch-up/read-model-catch-up.module'
import { MessageRecacheService } from './message-recache/message-recache.service'

@Module({
  imports: [ReadModelCatchUpModule, CqrsModule, DiscordModule],
  providers: [MessageRecacheService],
})
export class ServicesModule {}
