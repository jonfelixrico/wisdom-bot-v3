import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { ISettings } from '../entities/guild.interface'
import { EventPayload } from './event-payload.type'

export interface IGuildSettingsUpdatedEventPayload
  extends ISettings,
    EventPayload {
  guildId: string
}

export class GuildSettingsUpdatedEvent extends DomainEvent<IGuildSettingsUpdatedEventPayload> {
  constructor(payload: IGuildSettingsUpdatedEventPayload) {
    super(DomainEventNames.GUILD_SETTINGS_UPDATED, payload.guildId, payload)
  }
}
