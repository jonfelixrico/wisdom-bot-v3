import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'

import {
  GuildTopReceivedQuotesQuery,
  IGuildTopReceivedQuotesQueryOutput,
} from 'src/queries/guild-top-received-quotes.query'

import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'guild-top-quote',
  group: 'commands',
  memberName: 'guild-top-quote',
  description: 'Get the top 10 most-received quotes of a guild.',
  guildOnly: true,
}

const LIMIT = 10

@Injectable()
export class GuildTopQuoteService extends WrappedCommand {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const results: IGuildTopReceivedQuotesQueryOutput =
      await this.queryBus.execute(
        new GuildTopReceivedQuotesQuery({
          limit: LIMIT,
          guildId: message.guild.id,
        }),
      )

    const { guild } = message

    const embed: MessageEmbedOptions = {
      author: {
        name: `Top quotes for ${guild}`,
        icon_url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!results.length) {
      embed.description = `No quotes yet for ${guild}.`
      return message.channel.send(new MessageEmbed(embed))
    }

    // TODO add year
    embed.description = results
      .map(({ authorId, receives, content }, index) =>
        [
          `${index + 1}. **"${content}"**`,
          `- <@${authorId}> (${receives})`,
        ].join('\n'),
      )
      .join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of receives.',
    }

    return message.channel.send(new MessageEmbed(embed))
  }
}
