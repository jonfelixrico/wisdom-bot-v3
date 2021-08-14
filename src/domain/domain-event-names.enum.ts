export enum DomainEventNames {
  QUOTE_SUBMITTED = 'QUOTE_SUBMITTED',

  PENDING_QUOTE_ACCEPTED = 'PENDING_QUOTE_ACCEPTED',
  PENDING_QUOTE_CANCELLED = 'PENDING_QUOTE_CANCELLED',
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED = 'PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED',

  PENDING_QUOTE_VOTE_CASTED = 'PENDING_QUOTE_VOTE_CASTED',
  PEDNING_QUOTE_VOTE_WITHDRAWN = 'PENDING_QUOTE_VOTE_WITHDRAWN',

  QUOTE_MESSAGE_DETAILS_UPDATED = 'QUOTE_MESSAGE_DETAILS_UPDATED',

  RECEIVE_CREATED = 'RECEIVE_CREATED',
  RECEIVE_REACTED = 'RECEIVE_REACTED',

  GUILD_REGISTERED = 'GUILD_REGISTERED',
  GUILD_SETTINGS_UPDATED = 'GUILD_SETTINGS_UPDATED',
  GUILD_QUOTE_SETTINGS_UPDATED = 'GUILD_QUOTE_SETTINGS_UPDATED',
}
