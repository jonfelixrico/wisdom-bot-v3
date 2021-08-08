import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'
import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import {
  AuthorTopContributorsQuery,
  IAuthorTopContributorsQueryOutput,
} from 'src/queries/author-top-contributor.query'
import {
  GuildTopContributorsQuery,
  IGuildTopContributorsQueryOutput,
} from 'src/queries/guild-top-contributors.query'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'contributors',
  group: 'commands',
  memberName: 'contributors',
  description:
    'Displays the top contributors for the server or for a certain user.',
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

interface ITopContributorsCommandArgs extends IArgumentMap {
  user?: User
}

const LIMIT = 10

@Injectable()
export class TopContributorsCommandService extends WrappedCommand<ITopContributorsCommandArgs> {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async handleAuthor(
    message: CommandoMessage,
    user: User,
  ): Promise<MessageEmbedOptions> {
    const results: IAuthorTopContributorsQueryOutput =
      await this.queryBus.execute(
        new AuthorTopContributorsQuery({
          limit: LIMIT,
          authorId: user.id,
          guildId: message.guild.id,
        }),
      )

    if (!results.length) {
      return {
        description: `No contributions yet for ${user}.`,
      }
    }

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Contributors',
        icon_url: await user.displayAvatarURL({ format: 'png' }),
      },

      description: [
        `**Top Contributors for ${user}**`,
        '', // padding
        ...results.map(
          ({ contributions, userId }, index) =>
            `${index + 1}. <@${userId}> - ${contributions}`,
        ),
      ].join('\n'),
    }

    return embed
  }

  async handleGuild(message: CommandoMessage): Promise<MessageEmbedOptions> {
    const results: IGuildTopContributorsQueryOutput =
      await this.queryBus.execute(
        new GuildTopContributorsQuery({
          limit: LIMIT,
          guildId: message.guild.id,
        }),
      )

    const guild = message.guild

    if (!results.length) {
      return {
        description: `No contributions yet for ${guild}.`,
      }
    }

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Contributors',
        icon_url: await guild.iconURL({ format: 'png' }),
      },

      description: [
        `**Top Contributors for ${guild}**`,
        '', // padding
        ...results.map(
          ({ contributions, userId }, index) =>
            `${index + 1}. <@${userId}> - ${contributions}`,
        ),
      ].join('\n'),
    }

    return embed
  }

  async run(
    message: CommandoMessage,
    { user }: ITopContributorsCommandArgs,
  ): Promise<Message | Message[]> {
    let embed: MessageEmbedOptions

    if (user) {
      embed = await this.handleAuthor(message, user)
    } else {
      embed = await this.handleGuild(message)
    }

    return message.channel.send(new MessageEmbed(embed))
  }
}
