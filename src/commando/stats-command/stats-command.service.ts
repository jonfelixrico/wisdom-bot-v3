import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import { sprintf } from 'sprintf-js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { StatsRepository } from 'src/classes/stats-repository.abstract'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'stats',
  description: 'test',
  group: 'commands',
  memberName: 'stats',
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

interface IReceiveCommandArgs extends IArgumentMap {
  user?: User
}

@Injectable()
export class StatsCommandService extends WrappedCommand<IReceiveCommandArgs> {
  constructor(client: CommandoClient, private statsRepo: StatsRepository) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IReceiveCommandArgs,
  ): Promise<Message | Message[]> {
    const userId = user ? user.id : message.author.id
    const guildId = message.guild.id
    const authoredStats = await this.statsRepo.getSubmittedQuoteStats(
      userId,
      guildId,
    )

    const personalStats = await this.statsRepo.getPersonalQuoteStats(
      userId,
      guildId,
    )

    const texts = [
      sprintf('Quotes authored: **%d**', authoredStats.quotes),
      sprintf('Total number of receives: **%d**', authoredStats.receives),
      sprintf('Total number of concurs: **%d**', authoredStats.concurs),
      sprintf('No. of quotes submitted: **%d**', personalStats.quotes),
      sprintf('No. of wisdom received: **%d**', personalStats.receives),
      sprintf('Times concurred: **%d**', personalStats.concurs),
    ]

    return await message.channel.send(texts.join('\n'))
  }
}
