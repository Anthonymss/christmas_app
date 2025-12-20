import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { PostsModule } from './posts/posts.module';
import { VotesModule } from './votes/votes.module';
import { RouletteModule } from './roulette/roulette.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';

@Module({
  imports:
    [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      ThrottlerModule.forRoot([{
        ttl: 60000,
        limit: 10,
      }]),
      TypeOrmModule.forRootAsync(databaseConfig),
      AuthModule,
      UsersModule,
      UploadsModule,
      PostsModule,
      VotesModule,
      RouletteModule,
      EventsModule,
      HealthModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule { }
