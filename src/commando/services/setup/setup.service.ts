import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandoClient } from 'discord.js-commando'

@Injectable()
export class SetupService {
  constructor(client: CommandoClient, config: ConfigService) {
    // default prefix
    client.commandPrefix = config.get('DISCORD_PREFIX') || `~wisdom`

    client.registry.registerDefaultTypes()
    client.registry.registerDefaultGroups()
    client.registry.registerDefaultCommands({
      help: true,
      ping: true,
    })
  }
}
