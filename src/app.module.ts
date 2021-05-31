import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RepositoriesModule } from './repositories/repositories.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => {
        return {
          type: 'mysql',
          host: cfg.get('DB_HOST'),
          port: cfg.get('DB_PORT'),
          database: cfg.get('DB_DATABASE'),
          username: cfg.get('DB_USERNAME'),
          password: cfg.get('DB_PASSWORD'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: !!cfg.get('DB_SYNC'),
        }
      },
      inject: [ConfigService],
    }),
    DiscordModule,
    RepositoriesModule,
  ],
})
export class AppModule {}
