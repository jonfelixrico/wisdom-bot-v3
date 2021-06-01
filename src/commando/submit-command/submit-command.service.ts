import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  ArgumentCollectorResult,
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'submit',
  aliases: ['add'],
  group: 'commands',
  memberName: 'submit',
  description:
    'Submit a new quote. This quote has to go through an approval process.',
  args: [
    {
      key: 'author',
      type: 'user',
      prompt: '',
    },
    {
      key: 'quote',
      type: 'string',
      prompt: '',
    },
    {
      key: 'year',
      type: 'integer',
      prompt: '',
    },
  ],
  argsPromptLimit: 0,
}

@Injectable()
export class SubmitCommandService extends WrappedCommand {
  constructor(client: CommandoClient) {
    super(client, COMMAND_INFO)
  }

  run<T = unknown>(
    message: CommandoMessage,
    args: string | string[] | Record<string, T>,
    fromPattern: boolean,
    result?: ArgumentCollectorResult<Record<string, T>>,
  ): Promise<Message | Message[]> {
    throw new Error('Method not implemented.')
  }
}
