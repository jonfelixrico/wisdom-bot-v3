import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import {
  GuildTopReceiversQuery,
  IGuildTopReceiversQueryOutput,
} from 'src/queries/guild-top-receivers.query'

import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'server-top-receivers',
  group: 'commands',
  memberName: 'server-top-receivers',
  description: 'Gets the top 10 most frequent receivers of the server.',
  guildOnly: true,
}

const LIMIT = 10

@Injectable()
export class GuildTopReceiversCommandService extends WrappedCommand {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run({ channel, guild }: CommandoMessage): Promise<Message | Message[]> {
    const results: IGuildTopReceiversQueryOutput = await this.queryBus.execute(
      new GuildTopReceiversQuery({
        limit: LIMIT,
        guildId: guild.id,
      }),
    )

    const embed: MessageEmbedOptions = {
      author: {
        name: `Top Receivers`,
        icon_url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!results.length) {
      embed.description = `No receivers yet for ${guild}.`
      return channel.send(new MessageEmbed(embed))
    }

    embed.description = [
      `Top receivers of ${guild}`,
      '',
      ...results.map(
        ({ receives, userId }, index) =>
          `${index + 1}. <@${userId}> - ${receives}`,
      ),
    ].join('\n')

    return channel.send(new MessageEmbed(embed))
  }
}
