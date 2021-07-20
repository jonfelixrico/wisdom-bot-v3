import { Injectable } from '@nestjs/common'
import {
  EmbedFieldData,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
  User,
} from 'discord.js'
import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import { UserStatsQueryService } from 'src/read-repositories/queries/user-stats-query/user-stats-query.service'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'stats',
  group: 'commands',
  memberName: 'user-stats',
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
      interactionsGiven,
      interactionsReceived,
      quotesAuthored,
      quotesSubmitted,
      receivesGiven,
      receivesReceived,
    } = await this.query.getStats(message.guild.id, targetUser.id)

    const toDisplay = [
      ['Quotes authored', quotesAuthored],
      ['Times authored quotes got received', receivesReceived],
      ['No. of interactions of authored quotes', interactionsReceived],
      ['Quotes submitted', quotesSubmitted],
      ['Quotes received', receivesGiven],
      ['Reactions given', interactionsGiven],
    ]

    const embed: MessageEmbedOptions = {
      author: {
        name: 'User Stats',
        icon_url: await targetUser.displayAvatarURL({ format: 'png' }),
      },
      description: `${targetUser}'s wisdom stats`,
      fields: toDisplay
        .map<[EmbedFieldData, EmbedFieldData, EmbedFieldData]>(
          ([title, value]) => {
            return [
              {
                name: SPACE_CHARACTER,
                value: `**${title}:**`,
                inline: true,
              },
              {
                name: SPACE_CHARACTER,
                value: SPACE_CHARACTER,
                inline: true,
              },
              {
                name: SPACE_CHARACTER,
                value,
                inline: true,
              },
            ]
          },
        )
        .flat(),
    }

    return await message.channel.send(new MessageEmbed(embed))
  }
}
