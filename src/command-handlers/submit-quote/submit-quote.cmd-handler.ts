import { CommandHandler } from '@nestjs/cqrs'
import { SubmitQuote } from 'src/domain/pending-quote/submit-quote.command'

@CommandHandler(SubmitQuote)
export class SubmitQuoteHandler {}
