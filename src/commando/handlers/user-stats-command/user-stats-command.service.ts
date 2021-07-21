import { Injectable } from '@nestjs/common'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'
import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import { UserStatsQueryService } from 'src/read-repositories/queries/user-stats-query/user-stats-query.service'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'stats',
  group: 'commands',
  memberName: 'user-stats',
  description: 'Show the wisdom stats of a specific user.',
  argsPromptLimit: 0,
  args: [
    {
      key: 'user',
      type: 'user',
      prompt: '',
      default: () => null,
    },
  ],
  guildOnly: true,
}

export interface IUserStatsCommandArgs extends IArgumentMap {
  user?: User
}

@Injectable()
export class UserStatsCommandService extends WrappedCommand<IUserStatsCommandArgs> {
  constructor(client: CommandoClient, private query: UserStatsQueryService) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IUserStatsCommandArgs,
  ): Promise<Message | Message[]> {
    const targetUser = user ?? message.author

    const {
      reactionCount,
      timesReactedTo,
      authoredQuotes,
      quotesSubmitted,
      receiveCount,
      timesReceived,
    } = await this.query.getStats(message.guild.id, targetUser.id)

    const embed: MessageEmbedOptions = {
      author: {
        name: 'User Stats',
        icon_url: await targetUser.displayAvatarURL({ format: 'png' }),
      },
      description: [
        '',
        `Wisdom stats for ${targetUser}`,
        '',
        `Author of **${authoredQuotes}** quotes; received **${timesReceived}** times`,
        `Received **${timesReactedTo}** reactions to authored quotes`,
        `Submitted **${quotesSubmitted}** quotes`,
        `Received **${receiveCount}** pieces of wisdom`,
        `Reacted **${reactionCount}** times to quotes`,
      ].join('\n'),
    }

    return await message.channel.send(new MessageEmbed(embed))
  }
}
