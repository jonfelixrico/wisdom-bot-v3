import { IQuery } from '@nestjs/cqrs'
import { IQuoteEntity } from 'src/domain/entities/quote.entity'
import { BaseGuildQueryInput } from 'src/stats-model/queries/common/base-guild-query-input.type'

export type SlimQuoteEntity = Omit<
  IQuoteEntity,
  'acceptDt' | 'guildId' | 'submitterId'
>
export interface GuildTopKarmaQuotesQueryOutputItem extends SlimQuoteEntity {
  karma: number
  reactionCount: number
}

export type GuildTopKarmaQuotesQueryOutput =
  GuildTopKarmaQuotesQueryOutputItem[]

export type GuildTopKarmaQuotesQueryInput = BaseGuildQueryInput

export class GuildTopKarmaQuotesQuery implements IQuery {
  constructor(readonly input: GuildTopKarmaQuotesQueryInput) {}
}
