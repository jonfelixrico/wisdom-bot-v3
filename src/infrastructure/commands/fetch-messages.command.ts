import { ICommand } from '@nestjs/cqrs'

export interface IFetchMessagesCommandPayload {
  guildId: string
  channelId: string
  messageIds: string[]
}

/**
 * Batch-fetches messages from a guild channel. Uses Discord.js under the hood, so these
 * fetched messages are cached.
 */
export class FetchMessagesCommand implements ICommand {
  constructor(readonly payload: IFetchMessagesCommandPayload) {}
}
