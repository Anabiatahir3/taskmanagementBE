import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateTodoDto } from 'src/dtos/todos/createTodo.dto';
import { TodoService } from './todo.service';
import { EditTodoDto } from 'src/dtos/todos/editTodo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}
  @Post()
  async createTodo(createDto: CreateTodoDto) {
    return await this.todoService.createTodo(createDto);
  }

  @Patch(':id')
  async editTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() editTodo: EditTodoDto,
  ) {
    return this.todoService.editTodo(id, editTodo);
  }
  @Delete('id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteTodo(id);
  }

  @Get('/all')
  async getAllTodos() {
    return this.todoService.getAllTodos();
  }
  @Get('id')
  async getTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodo(id);
  }
}
