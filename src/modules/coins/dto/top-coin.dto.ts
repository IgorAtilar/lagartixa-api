import { IsString, IsNumber, IsUrl, validateSync } from 'class-validator';

export type TopCoinData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
};

export class TopCoinDTO {
  @IsString()
  readonly id: string;

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly name: string;

  @IsString()
  @IsUrl()
  readonly image: string;

  @IsNumber()
  readonly currentPrice: number;

  constructor(data: TopCoinData) {
    this.id = data.id;
    this.symbol = data.symbol;
    this.name = data.name;
    this.image = data.image;
    this.currentPrice = data.current_price;
  }

  static fromData(data: TopCoinData): TopCoinDTO {
    const instance = new TopCoinDTO(data);

    const validationErrors = validateSync(instance);

    if (validationErrors.length > 0) {
      throw new Error('Validation failed!');
    }

    return instance;
  }

  static fromDataArray(data: TopCoinData[]): TopCoinDTO[] {
    return data.map((coin) => TopCoinDTO.fromData(coin));
  }
}
