import { Module } from '@nestjs/common';
import { CoinsModule } from './coins/coins.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CoinsModule,
  ],
})
export class AppModule {}
