import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'concur',
  aliases: ['amen'],
  description: 'Agree to a receive.',
  memberName: 'concur',
  group: 'commands',
}

@Injectable()
export class ConcurCommandService extends WrappedCommand {
  constructor(client: CommandoClient) {
    super(client, COMMAND_INFO)
  }

  async run({
    channel,
    reference,
  }: CommandoMessage): Promise<Message | Message[]> {
    return await channel.send([channel.id, reference?.messageID].join('/'))
  }
}
