import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandoClient,
  CommandInfo,
  ArgumentCollectorResult,
  CommandoMessage,
} from 'discord.js-commando'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

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
    private quoteRepo: QuoteRepository,
    private receiveRepo: ReceiveRepository,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    args: string | IReceiveCommandArgs | string[],
  ): Promise<Message | Message[]> {
    const { channel, guild, author } = message
    const response = await channel.send('Teka wait lang boss.')

    const quote = await this.quoteRepo.getRandomQuote(guild.id)
    if (!quote) {
      return response.edit('No quotes available.')
    }

    const receive = await this.receiveRepo.createRecieve({
      channelId: channel.id,
      guildId: guild.id,
      quoteId: quote.quoteId,
      userId: author.id,
    })

    return await response.edit(JSON.stringify({ quote, receive }))
  }
}
