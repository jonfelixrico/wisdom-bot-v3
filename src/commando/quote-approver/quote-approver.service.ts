import { Inject, Injectable, Logger } from '@nestjs/common'
import { filter, map } from 'rxjs/operators'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import {
  IPendingQuote,
  PendingQuoteRepository,
} from 'src/classes/pending-quote-repository.abstract'

function generateResponseString({
  content,
  submitterId,
  authorId,
  submitDt,
}: IPendingQuote) {
  const quoteLine = `**"${content}"** - <@${authorId}>, ${submitDt.getFullYear()}`
  const acceptLine = `<@${submitterId}>, your submission has been accepted.`

  return [quoteLine, acceptLine].join('\n')
}

@Injectable()
export class QuoteApproverService {
  constructor(
    private guildRepo: GuildRepoService,
    private pendingRepo: PendingQuoteRepository,
    private reactListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
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
    const quote = await this.pendingRepo.getPendingQuoteByMessageId(messageId)
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
  }: IPendingQuote): Promise<void> {
    this.guildRepo.deleteMessage(
      guildId,
      channelId,
      messageId,
      'Quote has been approved.',
    )
  }

  private async announceApproval(quote: IPendingQuote): Promise<void> {
    const channel = await this.guildRepo.getTextChannel(
      quote.guildId,
      quote.channelId,
    )

    if (!channel) {
      // TODO log warnings
      return
    }

    channel.send(generateResponseString(quote))
  }

  private async processQuote(quote: IPendingQuote) {
    const { quoteId, messageId, guildId } = quote
    await this.pendingRepo.approvePendingQuote(quoteId)
    this.logger.log(
      `Approved quote ${quoteId} of guild ${guildId}`,
      QuoteApproverService.name,
    )

    this.deleteListener.unwatch(messageId)
    this.reactListener.unwatch(messageId)

    await this.deleteMessage(quote)
    // TODO unsubscribe regenerator
    // TODO unsubscribe watcher
    await this.announceApproval(quote)
  }

  async approveQuote(quoteId: string): Promise<IPendingQuote> {
    const quote = await this.pendingRepo.getPendingQuote(quoteId)
    if (!quote) {
      // TODO log warnings
      return
    }

    await this.processQuote(quote)
  }
}
