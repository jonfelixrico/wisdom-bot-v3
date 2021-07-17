import { Injectable, Logger } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { InteractionHelperService } from 'src/commando/services/interaction-helper/interaction-helper.service'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'upvote',
  aliases: ['amen', 'upvote'],
  description: 'Upvote a received quote.',
  memberName: 'upvote',
  group: 'commands',
}

@Injectable()
export class UpvoteCommandService extends WrappedCommand {
  constructor(
    client: CommandoClient,
    private logger: Logger,
    private helper: InteractionHelperService,
  ) {
    super(client, COMMAND_INFO)
  }

  run(message: CommandoMessage): Promise<Message | Message[]> {
    return this.helper.handleInteraction(message, 1)
  }
}
