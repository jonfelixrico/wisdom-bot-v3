import { DomainErrorCodes } from './domain-error-codes.enum'

export class DomainError extends Error {
  constructor(readonly code: DomainErrorCodes, message?: string) {
    super(message)
  }
}
