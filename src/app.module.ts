import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { RepositoriesModule } from './repositories/repositories.module'
import { CommandsModule } from './commands/controllers.module'
import { TypeormModule } from './typeorm/typeorm.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    TypeormModule,
    DiscordModule,
    RepositoriesModule,
    CommandsModule,
  ],
})
export class AppModule {}
