import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  ArgumentCollectorResult,
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
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
  constructor(client: CommandoClient, private quoteRepo: QuoteRepository) {
    super(client, COMMAND_INFO)
  }

  run(
    message: CommandoMessage,
    args: string | string[] | Record<string, unknown>,
    fromPattern: boolean,
    result?: ArgumentCollectorResult<Record<string, unknown>>,
  ): Promise<Message | Message[]> {
    throw new Error('Method not implemented.')
  }
}
