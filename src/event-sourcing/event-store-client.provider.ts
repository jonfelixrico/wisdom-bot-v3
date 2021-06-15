import { Provider } from '@nestjs/common'
import { EventStoreDBClient } from '@eventstore/db-client'
import { ConfigService } from '@nestjs/config'

export const eventStoreProvider: Provider = {
  provide: EventStoreDBClient,
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) =>
    new EventStoreDBClient(
      {
        endpoint: cfg.get('ESDB_HOST'),
      },
      {
        insecure: true,
      },
    ),
}
