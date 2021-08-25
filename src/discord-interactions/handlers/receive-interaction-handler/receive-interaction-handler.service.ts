import { Logger } from '@nestjs/common'
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { sprintf } from 'sprintf-js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'
import { QuoteQueryService } from 'src/read-model-query/quote-query/quote-query.service'

@EventsHandler(DiscordInteractionEvent)
export class ReceiveInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(
    private logger: Logger,
    private quoteQuery: QuoteQueryService,
    private commandBus: CommandBus,
    private helper: DiscordHelperService,
  ) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'receive') {
      return
    }

    const { logger, quoteQuery, commandBus } = this
    const { guild, channel, user: receiver, options } = interaction

    const reply = await interaction.deferReply({ fetchReply: true })

    const author = options.getUser('author')

    const quoteId = await quoteQuery.getRandomQuoteId(guild.id, author?.id)
    if (!quoteId) {
      logger.verbose(
        author
          ? `No quotes found from user ${author.id} published under guild ${guild.id}.`
          : `No quotes found under guild ${guild.id}.`,
        ReceiveInteractionHandlerService.name,
      )

      return await interaction.editReply('No quotes available.')
    }

    await commandBus.execute(
      new ReceiveQuoteCommand({
        channelId: channel.id,
        quoteId,
        userId: receiver.id,
        messageId: reply.id,
      }),
    )

    logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      ReceiveInteractionHandlerService.name,
    )
  }
}
