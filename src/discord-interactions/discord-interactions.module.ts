import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { InteractionCreatedRelayService } from './services/interaction-created-relay/interaction-created-relay.service'
import { ReceiveInteractionHandlerService } from './handlers/receive-interaction-handler/receive-interaction-handler.service'

@Module({
  imports: [DiscordModule, CqrsModule],
  providers: [InteractionCreatedRelayService, ReceiveInteractionHandlerService],
})
export class DiscordInteractionsModule {}
