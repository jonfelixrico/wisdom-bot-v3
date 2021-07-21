import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { IQuoteSettings } from '../entities/guild.interface'
import { EventPayload } from './event-payload.type'

export interface IGuildQuoteSettingsUpdatedEventPayload
  extends IQuoteSettings,
    EventPayload {
  guildId: string
}

export class GuildQuoteSettingsUpdatedEvent extends DomainEvent<IGuildQuoteSettingsUpdatedEventPayload> {
  constructor(payload: IGuildQuoteSettingsUpdatedEventPayload) {
    super(
      DomainEventNames.GUILD_QUOTE_SETTINGS_UPDATED,
      payload.guildId,
      payload,
    )
  }
}
