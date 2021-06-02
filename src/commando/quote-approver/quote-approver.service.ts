import { Injectable } from '@nestjs/common'
import { filter, map } from 'rxjs/operators'
import {
  IPendingQuote,
  IQuote,
  QuoteRepository,
} from 'src/classes/quote-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'

@Injectable()
export class QuoteApproverService {
  constructor(
    private guildRepo: GuildRepoService,
    private quoteRepo: QuoteRepository,
    private reactListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
  ) {
    this.setUp()
  }

  private setUp() {
    const { reactListener } = this
    reactListener.emitter
      .pipe(
        filter(({ status }) => status === 'COMPLETE'),
        map(({ messageId }) => messageId),
      )
      .subscribe(this.approveQuoteByMessageId.bind(this))
  }

  private async approveQuoteByMessageId(messageId: string) {
    const quote = await this.quoteRepo.getPendingQuoteByMessageId(messageId)
    if (!quote) {
      // TODO add logging here
      return
    }

    await this.processQuote(quote)
  }

  private async deleteMessage({
    guildId,
    messageId,
    channelId,
  }: IQuote): Promise<void> {
    this.guildRepo.deleteMessage(
      guildId,
      channelId,
      messageId,
      'Quote has been approved.',
    )
  }

  private async announceApproval({
    guildId,
    channelId,
    submitterId,
    authorId,
    content,
  }: IQuote): Promise<void> {
    const channel = await this.guildRepo.getTextChannel(guildId, channelId)
    if (!channel) {
      // TODO log warnings
      return
    }

    channel.send([submitterId, authorId, content].join(' '))
  }

  private async processQuote(quote: IPendingQuote) {
    const { quoteId, messageId } = quote
    await this.quoteRepo.setApproveDt(quoteId)

    this.deleteListener.unwatch(messageId)
    this.reactListener.unwatch(messageId)

    await this.deleteMessage(quote)
    // TODO unsubscribe regenerator
    // TODO unsubscribe watcher
    await this.announceApproval(quote)
  }

  async approveQuote(quoteId: string): Promise<IQuote> {
    const quote = await this.quoteRepo.getPendingQuote(quoteId)
    if (!quote) {
      // TODO log warnings
      return
    }

    await this.processQuote(quote)
  }
}