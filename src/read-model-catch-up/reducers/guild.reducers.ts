import { IGuildRegisteredEventPayload } from 'src/domain/events/guild-registered.event'
import { GuildTypeormEntity } from 'src/typeorm/entities/guild.typeorm-entity'
import {
  TypeormReducerMap,
  TypeormReducer,
} from '../../types/typeorm-reducers.types'
import { IGuildSettingsUpdatedEventPayload } from 'src/domain/events/guild-settings-updated.event'
import { IGuildQuoteSettingsUpdatedEventPayload } from 'src/domain/events/guild-quote-settings-updated.event'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'

const registered: TypeormReducer<IGuildRegisteredEventPayload> = async (
  { revision, data },
  manager,
) => {
  const { guildId, ...guild } = data
  const entity = await manager.findOne(GuildTypeormEntity, guildId)

  if (entity) {
    return false
  }

  await manager.insert(GuildTypeormEntity, {
    revision,
    ...guild,
    id: guildId,
  })

  return true
}

const settingsUpdated: TypeormReducer<IGuildSettingsUpdatedEventPayload> =
  async ({ data, revision }, manager) => {
    const { guildId, ...settings } = data
    const { affected } = await manager.update(
      GuildTypeormEntity,
      {
        revision: revision - 1n,
        id: guildId,
      },
      {
        settings,
        revision,
      },
    )

    return !!affected
  }

const quoteSettingsUpdated: TypeormReducer<IGuildQuoteSettingsUpdatedEventPayload> =
  async ({ data, revision }, manager) => {
    const { guildId, ...quoteSettings } = data
    const { affected } = await manager.update(
      GuildTypeormEntity,
      {
        revision: revision - 1n,
        id: guildId,
      },
      {
        quoteSettings,
        revision,
      },
    )

    return !!affected
  }

const {
  GUILD_SETTINGS_UPDATED,
  GUILD_QUOTE_SETTINGS_UPDATED,
  GUILD_REGISTERED,
} = DomainEventNames

export const GUILD_REDUCERS: TypeormReducerMap = {
  [GUILD_QUOTE_SETTINGS_UPDATED]: quoteSettingsUpdated,
  [GUILD_REGISTERED]: registered,
  [GUILD_SETTINGS_UPDATED]: settingsUpdated,
}
