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
  Request,
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
  async createTodo(@Body() createDto: CreateTodoDto, @Request() req: any) {
    const userId = req.user.userId;
    return await this.todoService.createTodo(userId, createDto);
  }

  @Patch(':id')
  async editTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() editTodo: EditTodoDto,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return this.todoService.editTodo(userId, id, editTodo);
  }
  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.todoService.deleteTodo(id, userId);
  }

  @Get('/all')
  async getAllTodos(@Request() req: any) {
    const userId = req.user.userId;
    return this.todoService.getAllTodos(userId);
  }
  @Get(':id')
  async getTodo(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.todoService.getTodo(userId, id);
  }
}
