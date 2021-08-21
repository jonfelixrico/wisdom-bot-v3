import { SlashCommandBuilder } from '@discordjs/builders'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { REST } from '@discordjs/rest'
import { ConfigService } from '@nestjs/config'
import { Routes } from 'discord-api-types/v9'
import { Client } from 'discord.js'
import { RECEIVE_COMMAND } from './receive.discord-command'
import { SUBMIT_COMMAND } from './submit.discord-command'

const COMMANDS_TO_REGISTER = [RECEIVE_COMMAND, SUBMIT_COMMAND]

@Injectable()
export class CommandManagerService implements OnApplicationBootstrap {
  constructor(
    private config: ConfigService,
    private logger: Logger,
    private client: Client,
  ) {}

  private get getRegistrationRoute() {
    const { client, config } = this
    const debugGuildId = config.get('DISCORD_DEBUG_GUILD_ID')
    const applicationId = client.application.id

    if (!debugGuildId) {
      return Routes.applicationCommands(applicationId)
    }

    return Routes.applicationGuildCommands(applicationId, debugGuildId)
  }

  async onApplicationBootstrap() {
    const { logger, client } = this

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

    try {
      logger.verbose(
        `Initializing registration of ${COMMANDS_TO_REGISTER.length} commands.`,
        CommandManagerService.name,
      )

      await rest.put(this.getRegistrationRoute, {
        body: commandsAsJson,
      })

      logger.verbose(
        `Successfully initialized ${COMMANDS_TO_REGISTER.length} commands.`,
        CommandManagerService.name,
      )
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}
