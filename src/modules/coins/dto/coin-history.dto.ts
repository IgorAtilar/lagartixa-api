import {
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  validateSync,
} from 'class-validator';

export type CoinHistoryData = {
  prices: number[][];
};

export class CoinHistoryDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly prices: number[];

  constructor(data: CoinHistoryData) {
    this.prices = data.prices.map((price) => price[1]);
  }

  static fromData(data: CoinHistoryData): CoinHistoryDTO {
    const instance = new CoinHistoryDTO(data);

    const validationErrors = validateSync(instance);

    if (validationErrors.length > 0) {
      throw new Error('Validation failed!');
    }

    return instance;
  }
}
