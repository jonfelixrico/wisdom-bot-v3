import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Message, MessageEmbed } from 'discord.js'

import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'

import { WrappedCommand } from '../wrapped-command.class'

import { version } from '../../../../package.json'

const COMMAND_INFO: CommandInfo = {
  name: 'info',
  group: 'commands',
  memberName: 'info',
  description: 'Display the app information.',
  guildOnly: true,
}

@Injectable()
export class InfoCommandService extends WrappedCommand {
  constructor(client: CommandoClient, private queryBus: QueryBus) {
    super(client, COMMAND_INFO)
  }

  async run({
    channel,
    client,
  }: CommandoMessage): Promise<Message | Message[]> {
    return channel.send(
      new MessageEmbed({
        author: {
          name: 'Bot Information',
          icon_url: await client.user.displayAvatarURL({ format: 'png' }),
        },

        description: [client.user.username].join('\n'),

        // TODO add description for ko.fi

        footer: {
          text: `Build v${version}`,
        },
      }),
    )
  }
}
