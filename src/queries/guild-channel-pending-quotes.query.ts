import { IQuery } from '@nestjs/cqrs'
import { IPendingQuote } from 'src/domain/entities/pending-quote.entity'

export interface IGuildChannelPendingQuotesQueryInput {
  guildId: string
  channelId: string
}

export type IGuildChannelPendingQuotesQueryOutput = Omit<
  IPendingQuote,
  'votes'
>[]

/*
 * Query for getting the pending quotes of a guild channel.
 */
export class GuildChannelPendingQuotesQuery implements IQuery {
  constructor(readonly input: IGuildChannelPendingQuotesQueryInput) {}
}
