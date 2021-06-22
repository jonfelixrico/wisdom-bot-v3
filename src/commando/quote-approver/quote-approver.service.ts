import { Injectable } from '@nestjs/common'
import { filter, map } from 'rxjs/operators'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetPendingQuoteByMessageIdQuery } from 'src/read-repositories/queries/get-pending-quote-by-message-id.query'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'

function generateResponseString({
  content,
  submitterId,
  authorId,
  submitDt,
}: QuoteTypeormEntity) {
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
    private commandBus: CommandBus,
    // TODO this is just a temporary change so just that we'll be able to test
    private repo: QuoteTypeormRepository,
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

  private getQuoteIdByMessageId(
    messageId: string,
  ): Promise<QuoteTypeormEntity> {
    return this.repo.findOne({ messageId })
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
  }: QuoteTypeormEntity): Promise<void> {
    this.guildRepo.deleteMessage(
      guildId,
      channelId,
      messageId,
      'Quote has been approved.',
    )
  }

  private async announceApproval(quote: QuoteTypeormEntity): Promise<void> {
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

  private async processQuote(quote: QuoteTypeormEntity) {
    const { messageId } = quote

    this.commandBus.execute(new AcceptPendingQuoteCommand(quote.id))

    this.deleteListener.unwatch(messageId)
    this.reactListener.unwatch(messageId)

    await this.deleteMessage(quote)
    // TODO unsubscribe regenerator
    // TODO unsubscribe watcher
    await this.announceApproval(quote)
  }
}
