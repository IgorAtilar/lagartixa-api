export class CoinDTO {
  readonly id: number;
  readonly symbol: string;
  readonly name: string;
  readonly image: string;
  readonly currentPrice: number;
  readonly sparklineIn7d: number[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.symbol = data.symbol;
    this.image = data.image;
    this.currentPrice = data.current_price;
    this.sparklineIn7d = data.sparklineIn7d.price;
  }

  static fromData(data: any): CoinDTO {
    return new CoinDTO(data);
  }

  static fromDataArray(data: any[]): CoinDTO[] {
    return data.map((coin) => CoinDTO.fromData(coin));
  }
}
