import { Logger, OnModuleInit } from '@nestjs/common'
import {
  CommandBus,
  EventsHandler,
  IEventHandler,
  QueryBus,
} from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandManagerService } from 'src/discord-interactions/services/command-manager/command-manager.service'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { v4 } from 'uuid'
import { GuildQuery, IGuildQueryOuptut } from 'src/queries/guild.query'
import { DateTime } from 'luxon'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import {
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'

const COMMAND_NAME = 'submit'
const AUTHOR_OPTION_NAME = 'author'
const QUOTE_OPTION_NAME = 'quote'

@EventsHandler(DiscordInteractionEvent)
export class SubmitInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>, OnModuleInit
{
  constructor(
    private logger: Logger,
    private manager: CommandManagerService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  onModuleInit() {
    const command = new SlashCommandBuilder()
      .setName(COMMAND_NAME)
      .setDescription('Submit a quote.')
      .addUserOption((option) =>
        option
          .setName(AUTHOR_OPTION_NAME)
          .setDescription('The author of the quote.')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName(QUOTE_OPTION_NAME)
          .setDescription('The content of the quote.')
          .setRequired(true),
      )

    this.manager.registerCommand(command as SlashCommandBuilder)
  }

  async handle({ interaction }: DiscordInteractionEvent) {
    if (!interaction.isCommand() || interaction.commandName !== COMMAND_NAME) {
      return
    }

    const { logger } = this

    const { channelId, guildId, user: submitter, options } = interaction
    const quote = options.getString(QUOTE_OPTION_NAME)
    const author = options.getUser(AUTHOR_OPTION_NAME)

    try {
      // TODO add logging here

      await interaction.deferReply()

      const guild: IGuildQueryOuptut = await this.queryBus.execute(
        new GuildQuery({ guildId }),
      )

      // TODO add logging here

      const quoteId = v4()

      await this.commandBus.execute(
        new SubmitQuoteCommand({
          authorId: author.id,
          submitterId: submitter.id,
          channelId,
          content: quote,
          guildId,
          quoteId,
        }),
      )

      const { upvoteCount, upvoteWindow } = guild.quoteSettings
      const now = DateTime.now()
      const expireDt = now.plus({ millisecond: upvoteWindow })

      const embed: MessageEmbedOptions = {
        author: {
          name: 'Quote Submitted',
          icon_url: await submitter.displayAvatarURL({ format: 'png' }),
        },
        description: [`**"${quote}"**`, `- ${author}, ${now.year}`].join('\n'),
        fields: [
          {
            name: SPACE_CHARACTER,
            value: [
              `Submitted by ${submitter}`,
              `This submission needs ${upvoteCount} votes on or before ${expireDt.toLocaleString(
                DateTime.DATETIME_FULL,
              )}.`,
            ].join('\n\n'),
          },
        ],
        footer: {
          /*
           * We're using `footer` instead of `timestamp` because the latter adjusts with the Discord client device's
           * timezone (device of a discord user). We don't want that because it'll be inconsistent with our other date-related
           * strings if ever they did change timezones.
           */
          text: `Submitted on ${now.toLocaleString(DateTime.DATETIME_FULL)}`,
        },
        thumbnail: {
          url: await author.displayAvatarURL({ format: 'png' }),
        },
      }

      const row = new MessageActionRow({
        components: [
          new MessageButton({
            customId: `quote/${quoteId}/vote/1`,
            style: 'SUCCESS',
            emoji: '👍',
          }),
          new MessageButton({
            customId: `quote/${quoteId}/vote/-1`,
            style: 'DANGER',
            emoji: '👎',
          }),
        ],
      })

      await interaction.editReply({
        // TODO add buttons here for reactions
        embeds: [embed],
        components: [row],
      })

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
