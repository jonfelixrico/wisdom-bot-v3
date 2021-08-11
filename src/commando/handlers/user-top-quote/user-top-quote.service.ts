import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import {
  AuthorTopReceivedQuotesQuery,
  IAuthorTopReceivedQuotesQueryOutput,
} from 'src/queries/author-top-received-quotes.query'

import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'user-top-quote',
  group: 'commands',
  memberName: 'user-top-quote',
  description: 'Get the top 10 most-received quotes of a user.',
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

interface IUserTopQuotesCommandArgs extends IArgumentMap {
  user?: User
}

const LIMIT = 10

@Injectable()
export class UserTopQuoteService extends WrappedCommand<IUserTopQuotesCommandArgs> {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IUserTopQuotesCommandArgs,
  ): Promise<Message | Message[]> {
    user = user || message.author

    const results: IAuthorTopReceivedQuotesQueryOutput =
      await this.queryBus.execute(
        new AuthorTopReceivedQuotesQuery({
          limit: LIMIT,
          guildId: message.guild.id,
          authorId: user.id,
        }),
      )

    const embed: MessageEmbedOptions = {
      author: {
        name: `Top Quotes`,
        icon_url: await user.displayAvatarURL({ format: 'png' }),
      },
    }

    if (!results.length) {
      embed.description = `No quotes yet for ${user}.`
      return message.channel.send(new MessageEmbed(embed))
    }

    // TODO add year
    embed.description = [
      `Top quotes of ${user}`,
      '',
      ...results.map(
        ({ receives, content }, index) =>
          `${index + 1}. **"${content}"** (${receives})`,
      ),
    ].join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of receives.',
    }

    return message.channel.send(new MessageEmbed(embed))
  }
}
