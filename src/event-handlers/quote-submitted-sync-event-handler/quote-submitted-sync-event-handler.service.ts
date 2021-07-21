import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventBus, IEventHandler, ofType } from '@nestjs/cqrs'
import { MessageEmbed } from 'discord.js'
import { filter, map } from 'rxjs/operators'
import { submitResponseMessageFormatter } from 'src/commando/utils/submit-response-message-formatter.util'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { QuoteSubmittedEvent } from 'src/domain/events/quote-submitted.event'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

@Injectable()
export class QuoteSubmittedSyncEventHandlerService
  implements OnModuleInit, IEventHandler<QuoteSubmittedEvent>
{
  constructor(
    private eventBus: EventBus,
    private discordHelper: DiscordHelperService,
  ) {}

  async handle({ payload }: QuoteSubmittedEvent) {
    const {
      content,
      submitterId,
      guildId,
      authorId,
      channelId,
      expireDt,
      upvoteCount,
      upvoteEmoji,
      submitDt,
      messageId,
    } = payload

    const embed = submitResponseMessageFormatter({
      content,
      submitterId,
      submitterAvatarUrl: await this.discordHelper.getGuildMemberAvatarUrl(
        guildId,
        submitterId,
      ),
      authorId,
      authorAvatarUrl: await this.discordHelper.getGuildMemberAvatarUrl(
        guildId,
        authorId,
      ),
      expireDt,
      reactionCount: upvoteCount + 1,
      reactionEmoji: upvoteEmoji,
      submitDt,
    })

    const message = await this.discordHelper.getMessage(
      guildId,
      channelId,
      messageId,
    )

    await message.edit(null, new MessageEmbed(embed))
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(({ event }) => event instanceof QuoteSubmittedEvent),
        map(({ event }) => event as QuoteSubmittedEvent),
      )
      .subscribe(this.handle.bind(this))
  }
}
