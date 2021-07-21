import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { GuildQuoteSettingsUpdatedEvent } from '../events/guild-quote-settings-updated.event'
import { GuildRegisteredEvent } from '../events/guild-registered.event'
import { GuildSettingsUpdatedEvent } from '../events/guild-settings-updated.event'
import { IGuildEntity, IQuoteSettings, ISettings } from './guild.interfaces'
import { v4 } from 'uuid'
import { QuoteSubmittedEvent } from '../events/quote-submitted.event'

export interface ISubmittedQuote {
  content: string
  authorId: string
  submitterId: string

  // for tracking
  channelId?: string
  messageId?: string
}

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

  submitQuote(quote: ISubmittedQuote) {
    const { guildId, quoteSettings } = this
    const { upvoteCount, upvoteEmoji, upvoteWindow } = quoteSettings

    const quoteId = v4()
    const submitDt = new Date()
    const expireDt = new Date(submitDt.getTime() + upvoteWindow)

    this.apply(
      new QuoteSubmittedEvent({
        ...quote,
        quoteId,
        upvoteEmoji,
        upvoteCount,
        guildId,
        submitDt,
        expireDt,
      }),
    )
  }

  static register(entity: IGuildEntity) {
    const guild = new Guild(entity)
    guild.apply(new GuildRegisteredEvent(entity))
    return guild
  }
}
