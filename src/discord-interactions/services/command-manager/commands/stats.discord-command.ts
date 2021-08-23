import { SlashCommandBuilder } from '@discordjs/builders'
import { USER_STATS_SUBCOMMAND_GROUP } from './user-stats.discord-subcommand-group'
import { SERVER_STATS_SUBCOMMAND_GROUP } from './server-stats.discord-subcommand-group'

export const STATS_COMMAND = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Get the stats of a user or the server.')
  .addSubcommandGroup(USER_STATS_SUBCOMMAND_GROUP)
  .addSubcommandGroup(SERVER_STATS_SUBCOMMAND_GROUP)
