import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { MessageRecacheService } from './message-recache/message-recache.service'
import { MessageRegenerationService } from './message-regeneration/message-regeneration.service'

@Module({
  imports: [ReadRepositoriesModule, CqrsModule, DiscordModule],
  providers: [MessageRecacheService, MessageRegenerationService],
})
export class ServicesModule {}
