import { Injectable } from '@nestjs/common'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { PendingQuoteRepository } from 'src/classes/pending-quote-repository.abstract'

@Injectable()
export class QuoteRegeneratorService {
  constructor(
    private pendingRepo: PendingQuoteRepository,
    private guildRepo: GuildRepoService,
    private deleteListener: DeleteListenerService,
    private reactionListener: ReactionListenerService,
  ) {
    this.setUp()
  }

  setUp() {
    this.deleteListener.emitter.subscribe((messageId) => {
      this.regenerateMessage(messageId)
    })
  }

  async regenerateMessage(messageId: string) {
    const quote = await this.pendingRepo.getPendingQuoteByMessageId(messageId)
    if (!quote) {
      // TODO send warning/error
      return
    }

    const {
      channelId,
      guildId,
      quoteId,
      expireDt,
      approvalEmoji,
      approvalCount,
      authorId,
      content,
    } = quote

    const channel = await this.guildRepo.getTextChannel(guildId, channelId)

    const quoteLine = `**"${content}"** - <@${authorId}>, ${new Date().getFullYear()}`
    const instructionsLine = `_This submission needs ${
      approvalCount + 1
    } ${approvalEmoji} reacts to get reactions on or before *${expireDt}*._`

    const regenerated = await channel.send(
      ['**QUOTE REGENERATED**', quoteLine, instructionsLine].join('\n'),
    )

    this.reactionListener.watch(
      regenerated.id,
      approvalEmoji,
      approvalCount,
      expireDt,
    )

    this.deleteListener.watch(regenerated.id)
    await this.pendingRepo.updateMessageId(quoteId, regenerated.id)

    await regenerated.react(approvalEmoji)
  }
}
