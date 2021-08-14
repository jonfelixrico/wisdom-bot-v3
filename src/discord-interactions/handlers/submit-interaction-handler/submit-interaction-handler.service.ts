import { Logger, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandManagerService } from 'src/discord-interactions/services/command-manager/command-manager.service'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'

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

    const { commandBus } = this
    const { channelId, guildId, user: submitter, options } = interaction
    const quote = options.getString(QUOTE_OPTION_NAME)
    const author = options.getUser(AUTHOR_OPTION_NAME)

    // TODO add logging here

    await commandBus.execute(
      new SubmitQuoteCommand({
        authorId: author.id,
        submitterId: submitter.id,
        channelId,
        content: quote,
        guildId,
      }),
    )
  }
}
