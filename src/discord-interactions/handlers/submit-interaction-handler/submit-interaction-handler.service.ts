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
import { UpdateQuoteMessageDetailsCommand } from 'src/domain/commands/update-quote-message-details.command'
import { PendingQuoteResponseGeneratorService } from 'src/discord-interactions/services/pending-quote-response-generator/pending-quote-response-generator.service'

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
    private responseGen: PendingQuoteResponseGeneratorService,
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

    const { logger, commandBus } = this

    const { channelId, guildId, user: submitter, options } = interaction
    const content = options.getString(QUOTE_OPTION_NAME)
    const authorId = options.getUser(AUTHOR_OPTION_NAME).id
    const submitterId = submitter.id

    try {
      // TODO add logging here

      await interaction.deferReply()

      const guild: IGuildQueryOuptut = await this.queryBus.execute(
        new GuildQuery({ guildId }),
      )

      // TODO add logging here

      const quoteId = v4()
      const { upvoteCount, upvoteWindow } = guild.quoteSettings
      const submitDt = DateTime.now()
      const expireDt = submitDt.plus({ millisecond: upvoteWindow })

      await commandBus.execute(
        new SubmitQuoteCommand({
          authorId,
          submitterId,
          channelId,
          content,
          guildId,
          quoteId,
        }),
      )

      const generatedResponse = await this.responseGen.formatResponse({
        authorId,
        submitterId,
        channelId,
        content,
        guildId,
        quoteId,
        submitDt: submitDt.toJSDate(),
        expireDt: expireDt.toJSDate(),
        upvoteCount,
        votes: [],
      })

      const message = await interaction.editReply(generatedResponse)

      await commandBus.execute(
        new UpdateQuoteMessageDetailsCommand({
          channelId,
          messageId: message.id,
          quoteId,
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
