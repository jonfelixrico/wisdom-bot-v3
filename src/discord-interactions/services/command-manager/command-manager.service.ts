import { SlashCommandBuilder } from '@discordjs/builders'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'

@Injectable()
export class CommandManagerService implements OnApplicationBootstrap {
  private commandsToRegister: SlashCommandBuilder[] = []

  registerCommand(command: SlashCommandBuilder) {
    this.commandsToRegister.push(command)
  }

  onApplicationBootstrap() {
    // TODO register to discord here
    throw new Error('Method not implemented.')
  }
}
