import {
  Controller,
  Post,
  UseGuards,
  Body,
  Response,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserSignUpDto } from './dtos/user-sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Response({ passthrough: true }) res,
  ) {
    const { token } = await this.authService.login(userLoginDto);
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });

    return { token };
  }

  @Post('signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    return this.authService.signUp(userSignUpDto);
  }
}
