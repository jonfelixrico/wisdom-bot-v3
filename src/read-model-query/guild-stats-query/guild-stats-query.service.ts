import { Injectable } from '@nestjs/common'
import { ReactionTypeormRepository } from 'src/typeorm/providers/reaction.typeorm-repository'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'
import { Not } from 'typeorm'

@Injectable()
export class GuildStatsQueryService {
  constructor(
    private quoteRepo: QuoteTypeormRepository,
    private receiveRepo: ReceiveTypeormRepository,
    private reactionRepo: ReactionTypeormRepository,
  ) {}

  async getStats(guildId: string) {
    const quotes = await this.quoteRepo.count({
      where: {
        guildId,
        acceptDt: Not(null),
      },
    })

    const receives = await this.receiveRepo.count({
      where: { guildId },
    })

    const reactions = await this.reactionRepo.count({
      where: { guildId },
    })

    return {
      quotes,
      receives,
      reactions,
    }
  }
}
