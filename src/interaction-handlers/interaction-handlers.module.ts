import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { InteractionCreatedRelayService } from './services/interaction-created-relay/interaction-created-relay.service'

@Module({
  imports: [DiscordModule, CqrsModule],
  providers: [InteractionCreatedRelayService],
})
export class InteractionHandlersModule {}
