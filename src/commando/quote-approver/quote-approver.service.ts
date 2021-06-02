import { Injectable } from '@nestjs/common'
import { IQuote, QuoteRepository } from 'src/classes/quote-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'

@Injectable()
export class QuoteApproverService {
  constructor(
    private guildRepo: GuildRepoService,
    private quoteRepo: QuoteRepository,
  ) {}

  private async deleteMessage({
    guildId,
    messageId,
    channelId,
  }: IQuote): Promise<void> {
    this.guildRepo.deleteMessage(
      guildId,
      channelId,
      messageId,
      'Quote has been approve.d',
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

  async approveQuote(quoteId: string): Promise<IQuote> {
    const { quoteRepo } = this

    const quote = await quoteRepo.getPendingQuote(quoteId)
    if (!quote) {
      // TODO log warnings
      return
    }

    await quoteRepo.setApproveDt(quoteId)
    await this.deleteMessage(quote)
    // TODO unsubscribe regenerator
    // TODO unsubscribe watcher
    await this.announceApproval(quote)
  }
}
