import { ICommand } from '../command.interface'

export interface IAcknowledgePendingQuoteExpirationCommandPayload {
  quoteId: string
}

export class AcknowledgePendingQuoteExpirationCommand
  implements ICommand<IAcknowledgePendingQuoteExpirationCommandPayload>
{
  constructor(
    readonly payload: IAcknowledgePendingQuoteExpirationCommandPayload,
  ) {}
}
