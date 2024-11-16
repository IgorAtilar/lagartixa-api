import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserSignUpDto } from './dtos/user-sign-up.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userLoginDto: UserLoginDto) {
    try {
      const { email, password } = userLoginDto;

      const user = await this.usersService.findByEmail(email);

      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException();
    }
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.validateUser(userLoginDto);
    const payload = { email: user.email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async signUp(userSignUpDto: UserSignUpDto) {
    return this.usersService.create(userSignUpDto);
  }
}
