import { Controller, Get, Param } from '@nestjs/common';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get('top')
  async getTopCoins() {
    return this.coinsService.findTopCoins();
  }

  @Get(':id/history')
  async getCoinHistory(@Param('id') id: string) {
    return this.coinsService.findCoinHistory(id);
  }

  @Get(':id')
  async getCoinById(@Param('id') id: string) {
    console.log('id', id);
    return this.coinsService.findCoinById(id);
  }
}
