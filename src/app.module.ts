import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

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
          database: cfg.get('DB_DATABSE'),
          username: cfg.get('DB_USERNAME'),
          password: cfg.get('DB_PASSWORD'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: !!cfg.get('DB_SYNC'),
        }
      },
      inject: [ConfigService],
    }),
    DiscordModule,
  ],
})
export class AppModule {}
