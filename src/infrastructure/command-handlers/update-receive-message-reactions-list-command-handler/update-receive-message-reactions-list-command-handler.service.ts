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

    // TODO maybe use I18n listformat here?

    if (upvotes.length) {
      const { length } = upvotes
      fields.push({
        name: `Upvoted ${length} ${length === 1 ? 'time' : 'times'}`,
        value: upvotes.map((id) => `<@${id}>`).join(', '),
      })
    }

    if (downvotes.length) {
      const { length } = downvotes
      fields.push({
        name: `Downvoted ${length} ${length === 1 ? 'time' : 'times'}`,
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

    const { content, authorId, submitDt, receiveCount } = displayData.quote
    const { userId: receiverId } = displayData.receive

    const embed: MessageEmbedOptions = {
      title: 'Quote Received',
      description: [
        `**"${content}"**`,
        `<@${authorId}>, ${submitDt.getFullYear()}`,
      ].join('\n'),
      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Received by <@${receiverId}>`,
        },
      ],
      footer: {
        text: `This quote has been received ${receiveCount} ${
          receiveCount !== 1 ? 'times' : 'time'
        }`,
      },
      timestamp: new Date(),
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
