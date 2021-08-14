import { Logger } from '@nestjs/common'
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbed, MessageEmbedOptions, Util } from 'discord.js'
import { DiscordInteractionsModule } from 'src/discord-interactions/discord-interactions.module'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'
import { QuoteQueryService } from 'src/read-model-query/quote-query/quote-query.service'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import { SlashCommandBuilder } from '@discordjs/builders'

export const receiveCommand = new SlashCommandBuilder()
  .setName('receive')
  .setDescription('Gives you a random quote.')
  .addUserOption(
    (option) =>
      option
        .setName('author')
        .setDescription(
          'You can filter the author of the random quote by providing a mention.',
        )
        .setRequired(false), // explicitly set this to false
  )

@EventsHandler(DiscordInteractionsModule)
export class ReceiveInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(
    private logger: Logger,
    private quoteQuery: QuoteQueryService,
    private commandBus: CommandBus,
  ) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    // TODO get the string literal "receive" from an enum or something
    if (!interaction.isCommand() || interaction.commandName !== 'receive') {
      return
    }

    const { logger, quoteQuery, commandBus } = this
    const { guild, channel, user: receiver, options } = interaction

    await interaction.deferReply()

    // TODO get the string literal "author" from an enum
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

    const response = await interaction.editReply(
      'Retrieving quote information...',
    )
    await interaction.deferReply()

    const { year, content, authorId, receiveCount } =
      await quoteQuery.getQuoteData(quoteId)
    const newReceiveCount = receiveCount + 1

    await commandBus.execute(
      new ReceiveQuoteCommand({
        channelId: channel.id,
        messageId: response.id,
        quoteId,
        userId: receiver.id,
      }),
    )

    const embed: MessageEmbedOptions = {
      description: [
        `**"${Util.escapeMarkdown(content)}"**`,
        `- <@${authorId}>, ${year}`,
      ].join('\n'),

      author: {
        name: 'Quote Received',
        icon_url: await receiver.displayAvatarURL({ format: 'png' }),
      },

      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Received by ${receiver}`,
        },
      ],

      footer: {
        text: `This quote has been received ${newReceiveCount} ${
          newReceiveCount !== 1 ? 'times' : 'time'
        }`,
      },

      timestamp: new Date(),

      thumbnail: {
        url: await author.displayAvatarURL({ format: 'png' }),
      },
    }

    // TODO add buttons here for reactions

    await interaction.editReply({
      embeds: [new MessageEmbed(embed)],
    })

    logger.verbose(
      `Processed quote receive for ${quoteId}.`,
      ReceiveInteractionHandlerService.name,
    )
  }
}
