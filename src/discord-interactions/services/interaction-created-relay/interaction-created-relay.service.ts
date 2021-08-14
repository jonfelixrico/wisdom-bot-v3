import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { Client } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'

@Injectable()
export class InteractionCreatedRelayService implements OnApplicationBootstrap {
  constructor(
    private client: Client,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  onApplicationBootstrap() {
    const { client, eventBus, logger } = this

    client.on('interactionCreate', (interaction) => {
      eventBus.publish(new DiscordInteractionEvent(interaction))
      logger.debug(
        `Relayed interaction ${interaction.id} in guild ${interaction.guildId} on channel ${interaction.channelId}`,
        InteractionCreatedRelayService.name,
      )
    })
  }
}
