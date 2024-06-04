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
    let user: User = new User();
    user.email = createDto.email;
    user.password = await bcrypt.hash(createDto.password, 10);
    user.role = createDto.role || Role.User;
    const newUser = await this.UserRepository.save(user);
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload);
    const expirationTime = this.jwtService.decode(access_token).exp;

    // Get the current time in seconds (Unix epoch time)
    const currentTime = Math.floor(Date.now() / 1000);

    // Calculate the duration until expiration (in seconds)
    const expiresIn = expirationTime - currentTime;

    return {
      access_token: access_token,
      expiresIn: expiresIn,
    };
  }
  findUser(email: string): Promise<User> {
    return this.UserRepository.findOneBy({ email });
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
