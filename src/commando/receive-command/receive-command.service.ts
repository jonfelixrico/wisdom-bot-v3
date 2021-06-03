import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandoClient,
  CommandInfo,
  CommandoMessage,
} from 'discord.js-commando'
import { IQuote, QuoteRepository } from 'src/classes/quote-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

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

function generateResponseString(quote: IQuote) {
  return `**"${quote.content}"** - <@${
    quote.authorId
  }>, ${quote.submitDt.getFullYear()}`
}

@Injectable()
export class ReceiveCommandService extends WrappedCommand<IReceiveCommandArgs> {
  constructor(
    client: CommandoClient,
    private quoteRepo: QuoteRepository,
    private receiveRepo: ReceiveRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IReceiveCommandArgs,
  ): Promise<Message | Message[]> {
    const { channel, guild, author } = message

    const quote = await this.quoteRepo.getRandomQuote(guild.id, user?.id)
    if (!quote) {
      return channel.send('No quotes available.')
    }

    const response = await channel.send(generateResponseString(quote))

    const [{ receiveId }] = await this.receiveRepo.createRecieve({
      channelId: channel.id,
      guildId: guild.id,
      quoteId: quote.quoteId,
      userId: author.id,
      messageId: response.id,
    })

    this.logger.log(
      `Created receive ${receiveId} for quote ${quote.quoteId}`,
      ReceiveCommandService.name,
    )

    return response
  }
}
