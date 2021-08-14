import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { Client } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'

@Injectable()
export class InteractionCreatedRelayService implements OnApplicationBootstrap {
  constructor(private client: Client, private eventBus: EventBus) {}

  onApplicationBootstrap() {
    const { client, eventBus } = this
    client.on('interactionCreate', (interaction) => {
      eventBus.publish(new DiscordInteractionEvent(interaction))
    })
  }
}
