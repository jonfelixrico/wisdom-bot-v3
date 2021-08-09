import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'

import {
  GuildTopReceivedAuthorsQuery,
  IGuildTopReceivedAuthorsQueryOutput,
} from 'src/queries/guild-top-received-authors.query'

import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'top-authors',
  group: 'commands',
  memberName: 'top-authors',
  description:
    'Displays the top authors in a guild based on the amount of times their quotes got received.',
  guildOnly: true,
}

const LIMIT = 10

@Injectable()
export class TopAuthorsCommandService extends WrappedCommand {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const results: IGuildTopReceivedAuthorsQueryOutput =
      await this.queryBus.execute(
        new GuildTopReceivedAuthorsQuery({
          limit: LIMIT,
          guildId: message.guild.id,
        }),
      )

    const { guild } = message

    const embed: MessageEmbedOptions = {
      author: {
        name: `Top authors for ${guild.name}`,
        icon_url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!results.length) {
      embed.description = 'No authors found.'
      return message.channel.send(new MessageEmbed(embed))
    }

    embed.description = results
      .map(
        ({ authorId, receives }, index) =>
          `${index + 1}. <@${authorId}> - ${receives}`,
      )
      .join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of receives.',
    }

    return message.channel.send(new MessageEmbed(embed))
  }
}
