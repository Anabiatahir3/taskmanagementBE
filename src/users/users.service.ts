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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}
  async createUser(createDto: CreateDto) {
    let user: User = new User();
    user.email = createDto.email;
    user.password = await bcrypt.hash(createDto.password, 10);
    user.role = createDto.role || Role.User;

    return await this.UserRepository.save(user);
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
