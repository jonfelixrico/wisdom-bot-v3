import { Injectable } from '@nestjs/common'
import { CommandoClient } from 'discord.js-commando'

@Injectable()
export class SetupService {
  constructor(client: CommandoClient) {
    client.commandPrefix = '~wisdom'
    client.registry.registerDefaultTypes()
    client.registry.registerDefaultGroups()
    client.registry.registerDefaultCommands({
      help: true,
      ping: true,
    })
  }
}
