import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { MessageRecacheService } from './message-recache/message-recache.service'

@Module({
  imports: [ReadRepositoriesModule, CqrsModule, DiscordModule],
  providers: [MessageRecacheService],
})
export class ServicesModule {}
