import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'stats',
  description: 'test',
  group: 'commands',
  memberName: 'stats',
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

interface IReceiveCommandArgs extends IArgumentMap {
  user?: User
}

@Injectable()
export class StatsCommandService extends WrappedCommand<IReceiveCommandArgs> {
  constructor(client: CommandoClient) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IReceiveCommandArgs,
  ): Promise<Message | Message[]> {
    // TODO redo the stats command
    throw new Error('noop')
  }
}
