import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'

const BUTTON_ID_REGEXP = /quote\/(.+)\/vote\/(-?\d+)/

@EventsHandler(DiscordInteractionEvent)
export class QuoteVoteBtnInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  async handle({ interaction }: DiscordInteractionEvent) {
    if (
      !interaction.isButton() ||
      !BUTTON_ID_REGEXP.test(interaction.customId)
    ) {
      return
    }

    const [quoteId, vote] = BUTTON_ID_REGEXP.exec(interaction.customId).slice(1)
    await interaction.deferReply({ ephemeral: true })
    await interaction.editReply(`ack: ${quoteId} ${vote}`)
  }
}
