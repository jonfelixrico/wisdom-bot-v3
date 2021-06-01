import { Message } from 'discord.js'
import {
  ArgumentCollectorResult,
  Command,
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'

export abstract class WrappedCommand extends Command {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info)
    client.registry.registerCommand(this)
  }

  abstract run<T = unknown>(
    message: CommandoMessage,
    args: string | Record<string, T> | string[],
    fromPattern: boolean,
    result?: ArgumentCollectorResult<Record<string, T>>,
  ): Promise<Message | Message[]>
}
