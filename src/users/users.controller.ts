import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Param,
  Query,
  Patch,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from 'src/dtos/users/createUser.dto';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UserErrorInterceptor } from 'src/interceptors/errors.interceptor';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get(':id')
  getUsers(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() createDto: CreateDto) {
    return { id, ...createDto };
  }

  @Get()
  getAllUsers(@Query('role') role?: 'admin' | 'user') {
    this.usersService.getUsers();
  }

  @Post()
  createUser(@Body(ValidationPipe) createDto: CreateDto) {
    return this.usersService.createUser(createDto);
  }
}
