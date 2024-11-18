import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('coins')
@UseInterceptors(CacheInterceptor)
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
    return this.coinsService.findCoinById(id);
  }

  @Get('list/:ids')
  async getCoinsByIds(@Param('ids') ids: string) {
    const idsArray = ids.split(',');
    return this.coinsService.findCoinsByIds(idsArray);
  }

  @Get('search/:query')
  async searchCoins(@Param('query') query: string) {
    return this.coinsService.search(query);
  }
}
