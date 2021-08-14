import { IEvent } from '@nestjs/cqrs'
import { Interaction } from 'discord.js'

export class DiscordInteractionEvent implements IEvent {
  constructor(readonly interaction: Interaction) {}
}
