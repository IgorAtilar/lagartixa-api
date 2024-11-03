import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError } from 'rxjs';
import { CoinDTO } from './dto/coin.dto';
import { ConfigService } from '@nestjs/config';
import { COINS_TRENDING_MOCK } from './mock';

@Injectable()
export class CoinsService {
  private readonly logger = new Logger(CoinsService.name);
  private readonly apiUrl = this.configService.get<string>('coinsApi.url');
  private readonly apiKey = this.configService.get<string>('coinsApi.key');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    console.log('this.apiUrl', this.apiUrl);
    const url = new URL(`${this.apiUrl}${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
    );
    return url.toString();
  }

  private fetchTopCoins() {
    const url = this.buildUrl('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: true,
    });

    return this.httpService
      .get(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException('Failed to fetch top coins.');
        }),
      );
  }

  private handleError(error: any): void {
    const errorMessage = error.response?.data || 'Unknown error occurred';
    this.logger.error(errorMessage);
  }

  async findBestCoins(): Promise<CoinDTO[]> {
    // TODO: Descomentar quando for o momento de fazer a chamada para a API
    // const { data } = await firstValueFrom(this.fetchTopCoins());
    // return CoinDTO.fromDataArray(data);

    const TIMEOUT = 1000;

    return new Promise((resolve) => {
      return setTimeout(() => {
        resolve(CoinDTO.fromDataArray(COINS_TRENDING_MOCK));
      }, TIMEOUT);
    });
  }
}
