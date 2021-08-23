import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import {
  TypeormReducer,
  TypeormReducerMap,
} from 'src/types/typeorm-reducers.types'
import { EntityManager } from 'typeorm'
import { GuildMemberInteractionTypeormEntity } from '../db/entities/guild-member-interaction.typeorm-entity'
import { GuildMemberTypeormEntity } from '../db/entities/guild-member.typeorm-entity'
import { QuoteInfoTypeormEntity } from '../db/entities/quote-info.typeorm-entity'

interface IIncrementGuildMemberPropertyInput {
  guildId: string
  userId: string
  propertyToIncrement: 'receives' | 'submissions' | 'quoteReceives'
}

async function incrementGuildMemberProperty(
  { guildId, userId, propertyToIncrement }: IIncrementGuildMemberPropertyInput,
  manager: EntityManager,
) {
  const repo = manager.getRepository(GuildMemberTypeormEntity)

  const guildMember = await repo.findOne({ where: { guildId, userId } })

  if (!guildMember) {
    await repo.insert({
      guildId,
      userId,
      [propertyToIncrement]: 1,
    })
    return
  }

  await repo.update(
    { guildId, userId },
    {
      [propertyToIncrement]: guildMember[propertyToIncrement] + 1,
    },
  )
}

interface IIncrementGuildMemeberInteractionPropertyInput {
  guildId: string
  userId: string
  targetUserId: string
  // TODO rename submitted to submissions in the typeorm entity
  propertyToIncrement: 'receives' | 'submissions'
}

async function incrementGuildMemeberInteractionProperty(
  {
    guildId,
    propertyToIncrement,
    targetUserId,
    userId,
  }: IIncrementGuildMemeberInteractionPropertyInput,
  manager: EntityManager,
) {
  const repo = manager.getRepository(GuildMemberInteractionTypeormEntity)

  const interaction = await repo.findOne({
    where: {
      userId,
      targetUserId,
      guildId,
    },
  })

  if (interaction) {
    await repo.update(
      { id: interaction.id },
      {
        [propertyToIncrement]: interaction[propertyToIncrement] + 1,
      },
    )
    return
  }

  await repo.insert({
    userId,
    targetUserId,
    guildId,
    [propertyToIncrement]: 1,
  })
}

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

  await incrementGuildMemeberInteractionProperty(
    {
      guildId,
      userId: submitterId,
      targetUserId: authorId,
      propertyToIncrement: 'submissions',
    },
    manager,
  )

  await incrementGuildMemberProperty(
    {
      guildId,
      userId: submitterId,
      propertyToIncrement: 'submissions',
    },
    manager,
  )

  return true
}

const receive: TypeormReducer<IReceiveCreatedPayload> = async (
  { data },
  manager,
) => {
  const { quoteId, userId, guildId } = data

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

  await incrementGuildMemeberInteractionProperty(
    {
      guildId,
      userId,
      targetUserId: authorId,
      propertyToIncrement: 'receives',
    },
    manager,
  )

  await incrementGuildMemberProperty(
    {
      guildId,
      userId,
      propertyToIncrement: 'receives',
    },
    manager,
  )

  await incrementGuildMemberProperty(
    {
      guildId,
      userId: authorId,
      propertyToIncrement: 'quoteReceives',
    },
    manager,
  )

  return true
}

const { QUOTE_SUBMITTED, RECEIVE_CREATED } = DomainEventNames

export const STATS_REDUCERS: TypeormReducerMap = {
  [QUOTE_SUBMITTED]: submit,
  [RECEIVE_CREATED]: receive,
}
