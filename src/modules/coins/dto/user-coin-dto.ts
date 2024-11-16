import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserCoinDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
