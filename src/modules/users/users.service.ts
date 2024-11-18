import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from '../auth/dtos/user-sign-up.dto';
import { UserCoinDTO } from '../coins/dto/user-coin-dto';
import { UserCoin } from './user-coin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserCoin)
    private coinsRepository: Repository<UserCoin>,
  ) {}

  async getProfile(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    delete user.password;
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async create(userSignUpDto: UserSignUpDto) {
    const user = this.usersRepository.create(userSignUpDto);
    const createdUser = await this.usersRepository.save(user);
    delete createdUser.password;
    return createdUser;
  }

  async addCoin(userId: number, coinData: UserCoinDTO) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        coins: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const coin = this.coinsRepository.create({
      ...coinData,
      user,
    });

    const savedCoin = await this.coinsRepository.save(coin);

    delete savedCoin.user;

    return savedCoin;
  }

  async removeCoin(userId: number, coinId: string) {
    const coin = await this.coinsRepository.findOne({
      where: { id: coinId, userId },
    });

    if (!coin) {
      throw new Error('Coin not found or does not belong to the user');
    }

    await this.coinsRepository.remove(coin);
  }

  async updateCoin(userId: number, coinData: UserCoinDTO) {
    const { id: coinId, amount } = coinData;
    const coin = await this.coinsRepository.findOne({
      where: { id: coinId, userId },
    });

    if (!coin) {
      throw new Error('Coin not found or does not belong to the user');
    }

    const savedCoin = await this.coinsRepository.save({
      ...coin,
      amount,
    });

    delete savedCoin.user;

    return savedCoin;
  }

  async getCoins(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        coins: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.coins;
  }
}
