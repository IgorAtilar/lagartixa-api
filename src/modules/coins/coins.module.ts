import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
