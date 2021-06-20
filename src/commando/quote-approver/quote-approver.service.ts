import { Injectable } from '@nestjs/common'
import { filter, map } from 'rxjs/operators'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetPendingQuoteByMessageIdQuery } from 'src/read-repositories/queries/get-pending-quote-by-message-id.query'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'

interface IPendingQuote {
  messageId: string
  quoteId: string
  guildId: string
  channelId: string
  content: string
  submitterId: string
  authorId: string
  submitDt: Date
}

function generateResponseString({
  content,
  submitterId,
  authorId,
  submitDt,
}: IPendingQuote) {
  const quoteLine = `**"${content}"** - <@${authorId}>, ${new Date(
    submitDt,
  ).getFullYear()}`
  const acceptLine = `<@${submitterId}>, your submission has been accepted.`

  return [quoteLine, acceptLine].join('\n')
}

@Injectable()
export class QuoteApproverService {
  constructor(
    private guildRepo: GuildRepoService,
    private reactListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
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

  private async getQuoteIdByMessageId(
    messageId: string,
  ): Promise<IPendingQuote> {
    return await this.queryBus.execute(
      new GetPendingQuoteByMessageIdQuery(messageId),
    )
  }

  private async approveQuoteByMessageId(messageId: string): Promise<void> {
    const quote = await this.getQuoteIdByMessageId(messageId)
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
    const { messageId } = quote

    this.commandBus.execute(new AcceptPendingQuoteCommand(quote.quoteId))

    this.deleteListener.unwatch(messageId)
    this.reactListener.unwatch(messageId)

    await this.deleteMessage(quote)
    // TODO unsubscribe regenerator
    // TODO unsubscribe watcher
    await this.announceApproval(quote)
  }
}
