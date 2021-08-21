import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import {
  TypeormReducer,
  TypeormReducerMap,
} from 'src/types/typeorm-reducers.types'
import { GuildMemberInteractionTypeormEntity } from '../db/entities/guild-member-interaction.typeorm-entity'
import { QuoteInfoTypeormEntity } from '../db/entities/quote-info.typeorm-entity'

const submit: TypeormReducer<IQuoteSubmittedEventPayload> = async (
  { data },
  manager,
) => {
  const { quoteId, authorId, content, submitterId, guildId } = data

  await manager.insert(QuoteInfoTypeormEntity, {
    quoteId,
    authorId,
    content,
    guildId,
  })

  const intRepo = manager.getRepository(GuildMemberInteractionTypeormEntity)

  const interaction = await intRepo.findOne({
    where: {
      userId: submitterId,
      targetUserId: authorId,
      guildId,
    },
  })

  if (interaction) {
    const { id, submitted } = interaction
    await intRepo.update(
      { id },
      {
        submitted: submitted + 1,
      },
    )
  } else {
    await intRepo.insert({
      userId: submitterId,
      targetUserId: authorId,
      // hardcoded to 1 because this is the first time user has interacted with target
      submitted: 1,
      guildId,
    })
  }

  return true
}

const receive: TypeormReducer<IReceiveCreatedPayload> = async (
  { data },
  manager,
) => {
  const { quoteId, userId, guildId } = data

  const intRepo = manager.getRepository(GuildMemberInteractionTypeormEntity)
  const quoteRepo = manager.getRepository(QuoteInfoTypeormEntity)

  // we're looking for the author of the quote here
  const quote = await quoteRepo.findOne({
    where: { quoteId },
  })

  if (!quote) {
    /*
     * This is either a data error in the write repository (receive event before submit event),
     * or most probably the stats read model failed to call `submit`.
     */
    return false
  }

  await quoteRepo.update(
    {
      quoteId,
    },
    { receives: quote.receives + 1 },
  )

  const { authorId } = quote

  const interaction = await intRepo.findOne({
    where: {
      userId,
      targetUserId: authorId,
      guildId,
    },
  })

  if (interaction) {
    const { id, receives } = interaction
    await intRepo.update(
      { id },
      {
        receives: receives + 1,
      },
    )
  } else {
    await intRepo.insert({
      userId,
      targetUserId: authorId,
      // hardcoded to 1 because this is the first time user has interacted with target
      receives: 1,
      guildId,
    })
  }

  return true
}

const { QUOTE_SUBMITTED, RECEIVE_CREATED } = DomainEventNames

export const STATS_REDUCERS: TypeormReducerMap = {
  [QUOTE_SUBMITTED]: submit,
  [RECEIVE_CREATED]: receive,
}
