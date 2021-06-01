import { Command, CommandInfo, CommandoClient } from 'discord.js-commando'

export abstract class WrappedCommand extends Command {
  constructor(client: CommandoClient, info: CommandInfo) {
    super(client, info)
    client.registry.registerCommand(this)
  }
}
