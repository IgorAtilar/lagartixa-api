import { IsEmail, IsString, Length } from 'class-validator';

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @Length(4, 20)
  nickname: string;
}
