import { Snowflake } from 'discord-api-types'

export interface BaseGuildQueryInput {
  guildId: Snowflake
  limit?: number
}
