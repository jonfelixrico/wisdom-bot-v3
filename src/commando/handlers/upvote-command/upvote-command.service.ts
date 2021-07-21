import { Injectable, Logger } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { ReactionHelperService } from 'src/commando/services/reaction-helper/reaction-helper.service'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'upvote',
  aliases: ['amen', 'upvote'],
  description: 'Upvote a received quote.',
  memberName: 'upvote',
  group: 'commands',
  guildOnly: true,
}

@Injectable()
export class UpvoteCommandService extends WrappedCommand {
  constructor(
    client: CommandoClient,
    private logger: Logger,
    private helper: ReactionHelperService,
  ) {
    super(client, COMMAND_INFO)
  }

  run(message: CommandoMessage): Promise<Message | Message[]> {
    return this.helper.handleReaction(message, 1)
  }
}
