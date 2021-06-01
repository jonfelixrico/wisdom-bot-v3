import { Message } from 'discord.js'
import {
  ArgumentCollectorResult,
  Command,
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'

export interface IArgumentMap {
  [key: string]: unknown
}

export abstract class WrappedCommand<
  T extends IArgumentMap = IArgumentMap,
> extends Command {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info)
    client.registry.registerCommand(this)
  }

  abstract run(
    message: CommandoMessage,
    args: string | T | string[],
    fromPattern: boolean,
    result?: ArgumentCollectorResult<T>,
  ): Promise<Message | Message[]>
}