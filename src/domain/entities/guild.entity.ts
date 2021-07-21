import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { GuildQuoteSettingsUpdatedEvent } from '../events/guild-quote-settings-updated.event'
import { GuildRegisteredEvent } from '../events/guild-registered.event'
import { GuildSettingsUpdatedEvent } from '../events/guild-settings-updated.event'
import { IGuildEntity, IQuoteSettings, ISettings } from './guild.interface'

export class Guild extends DomainEntity implements IGuildEntity {
  guildId: string
  settings: ISettings
  quoteSettings: IQuoteSettings

  constructor({ guildId, settings, quoteSettings }: IGuildEntity) {
    super()

    this.guildId = guildId
    this.settings = settings
    this.quoteSettings = quoteSettings
  }

  updateSettings(settings: ISettings) {
    this.settings = settings

    this.apply(
      new GuildSettingsUpdatedEvent({
        ...settings,
        guildId: this.guildId,
      }),
    )
  }

  updateQuoteSettings(settings: IQuoteSettings) {
    this.quoteSettings = settings
    this.apply(
      new GuildQuoteSettingsUpdatedEvent({
        ...settings,
        guildId: this.guildId,
      }),
    )
  }

  static register(entity: IGuildEntity) {
    const guild = new Guild(entity)
    guild.apply(new GuildRegisteredEvent(entity))
    return guild
  }
}
