import { Module } from '@nestjs/common';
import { CoinsModule } from './coins/coins.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UserCoin } from './users/user-coin.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3 * 60000,
      max: 10,
      isGlobal: true, // Global configuration
    }),
    TypeOrmModule.forRoot({
      database: 'lagartixa.db',
      synchronize: true,
      type: 'sqlite',
      entities: [User, UserCoin],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CoinsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
