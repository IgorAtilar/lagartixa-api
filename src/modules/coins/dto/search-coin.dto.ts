import {
  IsString,
  IsNumber,
  IsUrl,
  validateSync,
  IsOptional,
} from 'class-validator';

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
};

export type SearchCoinData = {
  coins: CoinData[];
};

export class SearchCoinDTO {
  @IsString()
  readonly id: string;

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  @IsOptional()
  readonly marketCapRank: number;

  @IsString()
  @IsUrl()
  readonly thumb: string;

  @IsString()
  @IsUrl()
  readonly large: string;

  constructor(data: CoinData) {
    this.id = data.id;
    this.symbol = data.symbol;
    this.name = data.name;
    this.marketCapRank = data.market_cap_rank;
    this.thumb = data.thumb;
    this.large = data.large;
  }

  static fromData(data: CoinData): SearchCoinDTO {
    const instance = new SearchCoinDTO(data);

    const validationErrors = validateSync(instance);

    if (validationErrors.length > 0) {
      throw new Error('Validation failed!');
    }

    return instance;
  }

  static fromDataArray(data: CoinData[]): SearchCoinDTO[] {
    return data.map((coin) => SearchCoinDTO.fromData(coin));
  }
}
