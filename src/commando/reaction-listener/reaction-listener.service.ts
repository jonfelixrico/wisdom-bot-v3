import { Injectable } from '@nestjs/common'
import { Message, MessageReaction } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { fromEvent, merge, Observable, of, race, Subject, timer } from 'rxjs'
import { debounceTime, filter, map, mapTo } from 'rxjs/operators'

type ReactionChange = [MessageReaction]

const reactionMapFn = ([reaction]: ReactionChange) => reaction.message

function buildSubjects(client: CommandoClient) {
  const reactionAdd$ = fromEvent<ReactionChange>(
    client,
    'messageReactionAdd',
  ).pipe(map(reactionMapFn))

  const reactionRemove$ = fromEvent<ReactionChange>(
    client,
    'messageReactionRemove',
  ).pipe(map(reactionMapFn))

  const reactionRemoveAll$ = fromEvent<Message>(
    client,
    'messageReactionRemoveAll',
  )

  return merge(reactionAdd$, reactionRemove$, reactionRemoveAll$).pipe(
    map((message) => message as Message),
    filter(({ author }) => author.id === client.user.id),
    debounceTime(2500),
  )
}

function getMessageReactionForEmoji(message: Message, emojiName: string) {
  return message.reactions.cache.array().find((r) => r.emoji.name === emojiName)
}

@Injectable()
export class ReactionListenerService {
  private reactionChange$: Observable<Message>
  private unsubscribe$ = new Subject<string>()
  private client: CommandoClient

  constructor(client: CommandoClient) {
    this.client = client
    this.reactionChange$ = buildSubjects(client)
  }

  createObserver(
    messageId: string,
    emojiName: string,
    count: number,
    expireDt: Date,
  ) {
    if (expireDt >= new Date()) {
      return of(false)
    }

    const expire$ = timer(expireDt).pipe(mapTo(false))
    const cancel$ = this.unsubscribe$.pipe(
      filter((val) => val === messageId),
      mapTo(null),
    )

    const complete$ = this.reactionChange$.pipe(
      filter(({ id }) => id === messageId),
      map((message) => getMessageReactionForEmoji(message, emojiName)),
      filter(
        (mr) =>
          !!mr &&
          mr.users.cache.filter((u) => u.id !== this.client.user.id).size >=
            count,
      ),
      mapTo(true),
    )

    return race(expire$, complete$, cancel$)
  }
}
