import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandoMessage,
  ArgumentCollectorResult,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'receive',
  group: 'commands',
  memberName: 'receive',
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

@Injectable()
export class ReceiveCommandService extends WrappedCommand {
  constructor(client: CommandoClient) {
    super(client, COMMAND_INFO)
  }

  run(
    message: CommandoMessage,
    args: string | Record<string, unknown> | string[],
    fromPattern: boolean,
    result?: ArgumentCollectorResult<Record<string, unknown>>,
  ): Promise<Message | Message[]> {
    throw new Error('Method not implemented.')
  }
}
