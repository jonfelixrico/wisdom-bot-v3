import { Module } from '@nestjs/common'
import { discordProvider } from './discord/discord.provider'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [discordProvider],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    DiscordModule,
  ],
})
export class AppModule {}
