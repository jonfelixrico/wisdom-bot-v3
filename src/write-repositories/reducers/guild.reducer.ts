import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IGuildEntity } from 'src/domain/entities/guild.interfaces'
import { IGuildQuoteSettingsUpdatedEventPayload } from 'src/domain/events/guild-quote-settings-updated.event'
import { IGuildRegisteredEventPayload } from 'src/domain/events/guild-registered.event'
import { IGuildSettingsUpdatedEventPayload } from 'src/domain/events/guild-settings-updated.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const registered: WriteRepositoryReducer<
  IGuildRegisteredEventPayload,
  IGuildEntity
> = (data) => data

const settingsUpdated: WriteRepositoryReducer<
  IGuildSettingsUpdatedEventPayload,
  IGuildEntity
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = ({ guildId, ...data }, { settings, ...state }) => {
  return {
    ...state,
    settings: {
      ...settings,
      data,
    },
  }
}

const quoteSettingsUpdated: WriteRepositoryReducer<
  IGuildQuoteSettingsUpdatedEventPayload,
  IGuildEntity
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = ({ guildId, ...data }, { quoteSettings, ...state }) => {
  return {
    ...state,
    quoteSettings: {
      ...quoteSettings,
      data,
    },
  }
}

const {
  GUILD_QUOTE_SETTINGS_UPDATED,
  GUILD_REGISTERED,
  GUILD_SETTINGS_UPDATED,
} = DomainEventNames

export const GUILD_REDUCERS: WriteRepositoryReducerMap<IGuildEntity> = {
  [GUILD_QUOTE_SETTINGS_UPDATED]: quoteSettingsUpdated,
  [GUILD_REGISTERED]: registered,
  [GUILD_SETTINGS_UPDATED]: settingsUpdated,
}
