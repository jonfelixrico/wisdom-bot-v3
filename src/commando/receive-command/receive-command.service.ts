import { Injectable, Logger } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandoClient,
  CommandInfo,
  CommandoMessage,
} from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { QuoteQueryService } from 'src/read-repositories/queries/quote-query/quote-query.service'
import { CommandBus } from '@nestjs/cqrs'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'

const COMMAND_INFO: CommandInfo = {
  name: 'receive',
  group: 'commands',
  memberName: 'receive',
  description: 'Receive a random command.',
  argsPromptLimit: 0,
  args: [
    {
      key: 'user',
      type: 'user',
      prompt: '',
      default: () => null,
    },
  ],
}

export interface IReceiveCommandArgs extends IArgumentMap {
  user?: User
}

@Injectable()
export class ReceiveCommandService extends WrappedCommand<IReceiveCommandArgs> {
  constructor(
    client: CommandoClient,
    private quoteQuery: QuoteQueryService,
    private logger: Logger,
    private commandBus: CommandBus,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IReceiveCommandArgs,
  ): Promise<Message | Message[]> {
    const { channel, guild, author } = message

    const quoteId = await this.quoteQuery.getRandomQuoteId(guild.id, user?.id)
    if (!quoteId) {
      this.logger.verbose(
        user
          ? `No quotes found from user ${user.id} published under guild ${guild.id}.`
          : `No quotes found under guild ${guild.id}.`,
        ReceiveCommandService.name,
      )
      return channel.send('No quotes available.')
    }

    const { year, content, authorId } = await this.quoteQuery.getQuoteData(
      quoteId,
    )

    const response = await channel.send('🤔')
    await response.edit(`**"${content}"** - <@${authorId}>, ${year}`)

    this.commandBus.execute(
      new ReceiveQuoteCommand({
        channelId: channel.id,
        messageId: response.id,
        quoteId,
        userId: author.id,
      }),
    )

    this.logger.verbose(
      `Processed quote receive for ${quoteId}.`,
      ReceiveCommandService.name,
    )

    return response
  }
}
