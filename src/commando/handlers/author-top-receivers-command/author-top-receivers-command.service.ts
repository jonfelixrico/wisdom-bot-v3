import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import {
  AuthorTopReceiversQuery,
  IAuthorTopReceiversQueryOutput,
} from 'src/queries/author-top-receivers.query'

import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'user-top-receivers',
  group: 'commands',
  memberName: 'user-top-receivers',
  description: 'Get the top 10 most frequent receivers of a user.',
  guildOnly: true,
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

interface IUserTopReceiversCommandArgs extends IArgumentMap {
  user?: User
}

const LIMIT = 10

@Injectable()
export class AuthorTopReceiversCommandService extends WrappedCommand<IUserTopReceiversCommandArgs> {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IUserTopReceiversCommandArgs,
  ): Promise<Message | Message[]> {
    user = user || message.author

    const results: IAuthorTopReceiversQueryOutput = await this.queryBus.execute(
      new AuthorTopReceiversQuery({
        limit: LIMIT,
        guildId: message.guild.id,
        authorId: user.id,
      }),
    )

    const embed: MessageEmbedOptions = {
      author: {
        name: `Top Receivers`,
        icon_url: await user.displayAvatarURL({ format: 'png' }),
      },
    }

    if (!results.length) {
      embed.description = `No receivers yet for ${user}.`
      return message.channel.send(new MessageEmbed(embed))
    }

    embed.description = [
      `Top receivers of ${user}`,
      '',
      ...results.map(
        ({ receives, userId }, index) =>
          `${index + 1}. <@${userId}> - ${receives}`,
      ),
    ].join('\n')

    return message.channel.send(new MessageEmbed(embed))
  }
}
