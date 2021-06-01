import { Message } from 'discord.js'
import {
  ArgumentCollectorResult,
  Command,
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'

export type UnknownRecord = Record<string, unknown>

export abstract class WrappedCommand extends Command {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info)
    client.registry.registerCommand(this)
  }

  abstract run(
    message: CommandoMessage,
    args: string | UnknownRecord | string[],
    fromPattern: boolean,
    result?: ArgumentCollectorResult<UnknownRecord>,
  ): Promise<Message | Message[]>
}
