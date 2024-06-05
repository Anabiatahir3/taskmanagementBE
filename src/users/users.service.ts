import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDto } from 'src/dtos/users/createUser.dto';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async createUser(createDto: CreateDto) {
    const existingUser = await this.findUser(createDto.email);
    if (existingUser) {
      throw new BadRequestException('User with email already exists');
    }

    const user = new User();
    user.email = createDto.email;
    user.password = await bcrypt.hash(createDto.password, 10);
    user.role = createDto.role || Role.User;
    const newUser = await this.UserRepository.save(user);

    // Generate and save refresh token
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    newUser.refreshToken = refresh_token;
    await this.UserRepository.save(newUser);

    // Generate access token
    const access_token = this.jwtService.sign(payload);
    const expirationTime = this.jwtService.decode(access_token).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = expirationTime - currentTime;

    return {
      access_token,
      expiresIn,
      refresh_token,
    };
  }
  async findUser(email: string): Promise<User> {
    return await this.UserRepository.findOneBy({ email });
  }
  getUsers() {
    return this.UserRepository.find({});
  }

  async deleteUser(id: number) {
    const user = await this.UserRepository.findOneBy({ id }); //findOneBy method always has to be awaited
    if (!user) {
      throw new NotFoundException('User of the id not found');
    }
    await this.UserRepository.delete(id);
    return user;
  }
}
