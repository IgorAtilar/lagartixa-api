import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserCoinDTO } from '../coins/dto/user-coin-dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/coins')
  getCoins(@Req() req) {
    return this.usersService.getCoins(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/coins')
  addCoin(@Req() req, @Body() coinData: UserCoinDTO) {
    return this.usersService.addCoin(req.user.id, coinData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/coins/:coinId')
  updateCoin(@Req() req, @Body() coinData: { amount: number }) {
    return this.usersService.updateCoin(req.user.id, {
      id: req.params.coinId,
      amount: coinData.amount,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/coins/:coinId')
  removeCoin(@Req() req) {
    this.usersService.removeCoin(req.user.id, req.params.coinId);
  }
}
