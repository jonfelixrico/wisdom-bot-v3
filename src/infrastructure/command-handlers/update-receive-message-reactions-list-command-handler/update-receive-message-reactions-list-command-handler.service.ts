import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateReceiveMessageReactionsListCommand } from 'src/infrastructure/commands/update-receive-message-reactions-list.command'
import { ReceiveQueryService } from 'src/read-repositories/queries/receive-query/receive-query.service'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

@CommandHandler(UpdateReceiveMessageReactionsListCommand)
export class UpdateReceiveMessageReactionsListCommandHandlerService
  implements ICommandHandler<UpdateReceiveMessageReactionsListCommand>
{
  constructor(
    private helper: DiscordHelperService,
    private logger: Logger,
    private receiveQuery: ReceiveQueryService,
  ) {}

  private insertReactionList(
    embed: MessageEmbedOptions,
    upvotes: string[],
    downvotes: string[],
  ) {
    const fields = embed.fields

    // serves as our spacer
    fields.push({
      name: SPACE_CHARACTER,
      value: SPACE_CHARACTER,
    })

    // TODO maybe use I18n listformat here?

    if (upvotes.length) {
      const { length } = upvotes
      const term = length > 1 ? 'upvotes' : 'upvote'
      fields.push({
        name: `${length} ${term}`,
        value: upvotes.map((id) => `<@${id}>`).join(', '),
      })
    }

    if (downvotes.length) {
      const { length } = downvotes
      const term = length > 1 ? 'downvotes' : 'downvote'
      fields.push({
        name: `${length} ${term}`,
        value: downvotes.map((id) => `<@${id}>`).join(', '),
      })
    }
  }

  async execute({
    payload,
  }: UpdateReceiveMessageReactionsListCommand): Promise<any> {
    const { reactions, receiveId } = payload

    const displayData = await this.receiveQuery.getReceiveDisplayData(receiveId)
    if (!displayData) {
      this.logger.warn(
        `Can't pull up the display data for receive ${receiveId}.`,
        UpdateReceiveMessageReactionsListCommandHandlerService.name,
      )
      return null
    }

    const { channelId, guildId, messageId } = displayData.receive

    // message validation

    const message = await this.helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      this.logger.warn(
        `Can't find message ${messageId}.`,
        UpdateReceiveMessageReactionsListCommandHandlerService.name,
      )
      return
    } else if (message.deleted || !message.editable) {
      this.logger.warn(
        `Message ${messageId} cannot be edited any further.`,
        UpdateReceiveMessageReactionsListCommandHandlerService.name,
      )
      return
    }

    const { content, authorId, submitDt } = displayData.quote
    const { userId: receiverId } = displayData.receive

    const embed: MessageEmbedOptions = {
      title: 'Quote accepted!',
      description: `${content} - <@${authorId}>, ${submitDt.getFullYear()}`,
      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Received by <@${receiverId}>`,
        },
      ],
    }

    const authorAvatarUrl = await this.helper.getGuildMemberAvatarUrl(
      guildId,
      authorId,
    )

    if (authorAvatarUrl) {
      embed.thumbnail = {
        url: authorAvatarUrl,
      }
    }

    const { upvotes, downvotes } = reactions
    if (upvotes.length || downvotes.length) {
      this.insertReactionList(embed, upvotes, downvotes)
    }

    await message.edit(null, new MessageEmbed(embed))
  }
}
