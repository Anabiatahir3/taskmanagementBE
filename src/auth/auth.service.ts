import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return user;
    }
    return null;
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    const expirationTime = this.jwtService.decode(accessToken).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = expirationTime - currentTime;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async login(user: any) {
    return this.generateTokens(user);
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.refreshToken = null;
    await this.userRepository.save(user);
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    if (user.refreshToken === refreshToken) {
      return this.generateTokens(user);
    }
    throw new ForbiddenException('Invalid refresh token');
  }
}
