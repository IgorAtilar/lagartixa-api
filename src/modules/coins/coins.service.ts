import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { TopCoinData, TopCoinDTO } from './dto/top-coin.dto';
import { ConfigService } from '@nestjs/config';
import { CoinHistoryData, CoinHistoryDTO } from './dto/coin-history.dto';
import { CoinDetailsData, CoinDetailsDTO } from './dto/coin-details-dto';
import { CoinData, CoinDTO } from './dto/coin.dto';
import { SearchCoinData, SearchCoinDTO } from './dto/search-coin.dto';

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
    });

    return this.httpService
      .get<TopCoinData[]>(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException('Failed to fetch top coins.');
        }),
      );
  }

  private fetchCoinHistory(id: string) {
    const url = this.buildUrl(`/coins/${id}/market_chart`, {
      days: 7,
      interval: 'daily',
      vs_currency: 'usd',
    });

    console.log('url', url);

    return this.httpService
      .get<CoinHistoryData>(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException(
            'Failed to fetch coin history.',
          );
        }),
      );
  }

  private fetchCoinById(id: string) {
    const url = this.buildUrl(`/coins/${id}`);

    return this.httpService
      .get<CoinDetailsData>(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException('Failed to fetch coin.');
        }),
      );
  }

  private fetchCoinsByIds(ids: string[]) {
    const url = this.buildUrl('/coins/markets', {
      ids: ids.join(','),
      vs_currency: 'usd',
    });

    return this.httpService
      .get<CoinData[]>(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException('Failed to fetch coins.');
        }),
      );
  }

  private searchCoins(query: string) {
    const url = this.buildUrl('/search', {
      query,
    });

    return this.httpService
      .get<SearchCoinData>(url, {
        headers: { key: this.apiKey },
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw new InternalServerErrorException('Failed to search coins.');
        }),
      );
  }

  private handleError(error: any): void {
    const errorMessage = error.response?.data || 'Unknown error occurred';
    this.logger.error(errorMessage);
  }

  async findTopCoins(): Promise<TopCoinDTO[]> {
    const { data } = await firstValueFrom(this.fetchTopCoins());
    return TopCoinDTO.fromDataArray(data);
  }

  async findCoinHistory(id: string): Promise<CoinHistoryDTO> {
    const { data } = await firstValueFrom(this.fetchCoinHistory(id));
    return CoinHistoryDTO.fromData(data);
  }

  async findCoinById(id: string) {
    const { data } = await firstValueFrom(this.fetchCoinById(id));
    return CoinDetailsDTO.fromData(data);
  }

  async findCoinsByIds(ids: string[]) {
    const { data } = await firstValueFrom(this.fetchCoinsByIds(ids));
    return data.map((coin) => new CoinDTO(coin));
  }

  async search(query: string) {
    const { data } = await firstValueFrom(this.searchCoins(query));
    return SearchCoinDTO.fromDataArray(data.coins);
  }
}
