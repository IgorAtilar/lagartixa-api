import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 60,
      max: 10,
    }),
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
