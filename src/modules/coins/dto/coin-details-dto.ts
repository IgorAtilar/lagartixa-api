import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsUrl,
  validateSync,
} from 'class-validator';

export interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  description?: Record<string, string>;
  categories?: string[];
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  market_data?: {
    current_price?: {
      [currency: string]: number;
    };
  };
  market_cap_rank?: number;
  links?: {
    homepage?: string[];
  };
  genesis_date?: string;
}

export class CoinDetailsDTO {
  @IsString()
  readonly id: string;

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsArray()
  @IsOptional()
  readonly categories: string[];

  @IsString()
  readonly image: string;

  @IsNumber()
  readonly currentPrice: number;

  @IsNumber()
  readonly marketCapRank: number;

  @IsUrl()
  @IsOptional()
  readonly homepageUrl: string;

  @IsOptional()
  @IsString()
  readonly genesisDate: string;

  constructor(data: CoinDetailsData) {
    this.id = data.id;
    this.symbol = data.symbol;
    this.name = data.name;
    this.description = data.description?.en || '';
    this.categories = data.categories || [];
    this.image = data.image?.large || '';
    this.currentPrice = data.market_data?.current_price?.usd || 0;
    this.marketCapRank = data.market_cap_rank || 0;
    this.homepageUrl = data.links?.homepage ? data.links.homepage[0] : '';
    this.genesisDate = data.genesis_date || '';
  }

  static fromData(data: CoinDetailsData): CoinDetailsDTO {
    const instance = new CoinDetailsDTO(data);

    const validationErrors = validateSync(instance);

    if (validationErrors.length > 0) {
      throw new Error('Validation failed!');
    }

    return instance;
  }
}
