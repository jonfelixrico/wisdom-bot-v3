import { SlashCommandBuilder } from '@discordjs/builders'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { REST } from '@discordjs/rest'
import { ConfigService } from '@nestjs/config'
import { Routes } from 'discord-api-types/v9'
import { Client } from 'discord.js'

@Injectable()
export class CommandManagerService implements OnApplicationBootstrap {
  private commandsToRegister: SlashCommandBuilder[] = []

  constructor(
    private config: ConfigService,
    private logger: Logger,
    private client: Client,
  ) {}

  registerCommand(command: SlashCommandBuilder) {
    this.commandsToRegister.push(command)
  }

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
    const { commandsToRegister, logger, client } = this

    if (!commandsToRegister.length) {
      logger.verbose(
        'Skipped command registration because there are no commands provided.',
        CommandManagerService.name,
      )
    }

    const commandsAsJson = commandsToRegister.map((builder) => builder.toJSON())

    const rest = new REST({ version: '9' }).setToken(client.token)

    try {
      logger.verbose(
        `Initializing registration of ${commandsToRegister.length} commands.`,
        CommandManagerService.name,
      )

      await rest.put(this.getRegistrationRoute, {
        body: commandsAsJson,
      })

      logger.verbose(
        `Successfully initialized ${commandsToRegister.length} commands.`,
        CommandManagerService.name,
      )
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}
