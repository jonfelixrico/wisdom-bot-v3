import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { REST } from '@discordjs/rest'
import { ConfigService } from '@nestjs/config'
import { Routes } from 'discord-api-types/v9'
import { Client } from 'discord.js'
import { RECEIVE_COMMAND } from './commands/receive.discord-command'
import { SUBMIT_COMMAND } from './commands/submit.discord-command'
import { STATS_COMMAND } from './commands/stats.discord-command'

const COMMANDS_TO_REGISTER = [RECEIVE_COMMAND, SUBMIT_COMMAND, STATS_COMMAND]

@Injectable()
export class CommandManagerService implements OnApplicationBootstrap {
  constructor(
    private config: ConfigService,
    private logger: Logger,
    private client: Client,
  ) {}

  private get registrationRoutes(): `/${string}`[] {
    const { client, config } = this
    const debugGuildId = config.get('DISCORD_DEBUG_GUILD_ID')
    const applicationId = client.application.id

    const routes: `/${string}`[] = []

    routes.push(Routes.applicationCommands(applicationId))

    if (debugGuildId) {
      routes.push(Routes.applicationGuildCommands(applicationId, debugGuildId))
    }

    return routes
  }

  async onApplicationBootstrap() {
    const { logger, client, registrationRoutes } = this

    if (!COMMANDS_TO_REGISTER.length) {
      logger.verbose(
        'Skipped command registration because there are no commands provided.',
        CommandManagerService.name,
      )
    }

    const commandsAsJson = COMMANDS_TO_REGISTER.map((builder) =>
      builder.toJSON(),
    )

    const rest = new REST({ version: '9' }).setToken(client.token)

    logger.verbose(
      `Initializing registration of ${COMMANDS_TO_REGISTER.length} commands.`,
      CommandManagerService.name,
    )

    for (const route of registrationRoutes) {
      try {
        await rest.put(route, {
          body: commandsAsJson,
        })
      } catch (e) {
        this.logger.error(e.message, e.stack, CommandManagerService.name)
      }
    }

    logger.verbose(
      `Initialized ${COMMANDS_TO_REGISTER.length} commands.`,
      CommandManagerService.name,
    )
  }
}
