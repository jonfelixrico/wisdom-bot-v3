import { Logger } from '@nestjs/common'
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { v4 } from 'uuid'
@EventsHandler(DiscordInteractionEvent)
export class SubmitInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(private logger: Logger, private commandBus: CommandBus) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'submit') {
      return
    }

    const { logger, commandBus } = this

    const { channelId, guildId, user: submitter, options } = interaction
    const content = options.getString('quote')
    const authorId = options.getUser('author').id
    const submitterId = submitter.id

    try {
      await interaction.deferReply()

      const quoteId = v4()
      await commandBus.execute(
        new SubmitQuoteCommand({
          authorId,
          submitterId,
          channelId,
          content,
          guildId,
          quoteId,
          interactionToken: interaction.token,
        }),
      )

      logger.log(
        `Processed the quote submission of user ${submitter.id} in guild ${guildId}`,
        SubmitInteractionHandlerService.name,
      )
    } catch (e) {
      const err = e as Error
      logger.error(err.message, err.stack, SubmitInteractionHandlerService.name)

      await interaction.editReply({
        content:
          'Something went wrong while processing your submission. Try again later, maybe?',
      })
    }
  }
}
