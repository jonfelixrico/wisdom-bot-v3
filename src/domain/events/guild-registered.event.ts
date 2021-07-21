import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { IGuildEntity } from '../entities/guild.interfaces'
import { EventPayload } from './event-payload.type'

export interface IGuildRegisteredEventPayload
  extends IGuildEntity,
    EventPayload {}

export class GuildRegisteredEvent extends DomainEvent<IGuildRegisteredEventPayload> {
  constructor(payload: IGuildRegisteredEventPayload) {
    super(DomainEventNames.GUILD_REGISTERED, payload.guildId, payload)
  }
}
