import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateDto } from 'src/dtos/users/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from './guards/roles.guard';
import { DEFAULT_CIPHERS } from 'tls';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async signup(@Body(ValidationPipe) createUserDto: CreateDto) {
    return await this.usersService.createUser(createUserDto);
  }
  @Post('/login')
  @UseGuards(LocalAuthGuard) //local auth guard is handling the user credentials
  async login(@Request() req: any) {
    return this.authService.login(req.user); //in this we are returning the whole of the user
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() req: any) {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshToken(@Request() req: any) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshToken(userId, refreshToken);
  }
}
