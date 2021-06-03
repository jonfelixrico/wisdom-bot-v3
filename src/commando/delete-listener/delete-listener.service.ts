import { Inject, Injectable, Logger } from '@nestjs/common'
import { Client, Message } from 'discord.js'
import { Observable, Subject } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class DeleteListenerService {
  private deleteSubj = new Subject<Message>()
  private watched = new Set<string>()
  readonly emitter: Observable<string>

  constructor(
    private client: Client,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {
    this.setUp()

    this.emitter = this.deleteSubj.pipe(
      filter(({ author }) => author.id === this.client.user.id),
      map(({ id }) => id),
      filter((id) => this.watched.has(id)),
      tap((messageId) => {
        this.watched.delete(messageId)
        logger.verbose(
          `Message ${messageId} was detected to be deleted.`,
          DeleteListenerService.name,
        )
      }),
    )
  }

  private setUp() {
    const { client, deleteSubj } = this

    const emitMessageFn = (message: Message) => {
      deleteSubj.next(message)
    }

    client.on('messageDelete', emitMessageFn)
    client.on('messageDeleteBulk', (collection) => {
      collection.forEach(emitMessageFn)
    })
  }

  watch(messageId: string) {
    this.watched.add(messageId)
  }

  unwatch(messageId: string) {
    this.watched.delete(messageId)
  }
}
