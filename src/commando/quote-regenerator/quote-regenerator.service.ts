import { Injectable } from '@nestjs/common'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'

@Injectable()
export class QuoteRegeneratorService {
  constructor(
    private quoteRepo: QuoteRepository,
    private guildRepo: GuildRepoService,
    private delListener: DeleteListenerService,
  ) {}

  setUp() {
    this.delListener.delete$.subscribe((messageId) => {
      this.regenerateMessage(messageId)
    })
  }

  async regenerateMessage(messageId: string) {
    const quote = await this.quoteRepo.getPendingQuoteByMessageId(messageId)
    if (!quote) {
      // TODO send warning/error
      return
    }

    const { channelId, guildId, quoteId } = quote

    const channel = await this.guildRepo.getTextChannel(guildId, channelId)

    const regenerated = await channel.send(['regenerated', quoteId].join('/'))
    this.delListener.watch(messageId)
    await this.quoteRepo.setMessageId(quoteId, regenerated.id)
  }
}
