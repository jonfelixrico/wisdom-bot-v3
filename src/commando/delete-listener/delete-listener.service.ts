import { Injectable } from '@nestjs/common'
import { Client, Message } from 'discord.js'
import { Observable, Subject } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'

@Injectable()
export class DeleteListenerService {
  private deleteSubj = new Subject<Message>()
  private watched = new Set<string>()

  constructor(private client: Client) {
    this.setUp()
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

  get delete$(): Observable<string> {
    return this.deleteSubj.pipe(
      filter(({ author }) => author.id === this.client.user.id),
      map(({ id }) => id),
      filter((id) => this.watched.has(id)),
      tap((mesageId) => this.watched.delete(mesageId)),
    )
  }
}
