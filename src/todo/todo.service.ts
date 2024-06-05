import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/typeorm/entities/Todo';
import { CreateTodoDto } from 'src/dtos/todos/createTodo.dto';
import { EditTodoDto } from 'src/dtos/todos/editTodo.dto';
import { Status } from 'src/enums/status.enum';
import { User } from 'src/typeorm/entities/User';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async validateUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Login to create todo');
    }
    return user;
  }
  async createTodo(userId: number, createTodo: CreateTodoDto) {
    const user = await this.validateUser(userId);
    const newTodo = this.todoRepository.create({
      ...createTodo,
      user: user,
      status: Status.Active,
      createdAt: new Date(),
    });
    return this.todoRepository.save(newTodo);
  }
  //for toggling the status using this api only
  async editTodo(userId: number, id: number, editTodo: EditTodoDto) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });
    if (!todo) {
      throw new NotFoundException('No todo found for this id');
    }
    // Update only the properties present in editTodoDto
    Object.assign(todo, editTodo);
    return this.todoRepository.save(todo);
  }

  async deleteTodo(id: number, userId: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!todo) {
      throw new NotFoundException('Not found todo');
    }
    await this.todoRepository.delete(id);
    return todo;
  }
  async getTodo(userId: number, id: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async getAllTodos(userId: number, status: Status) {
    if (!status) {
      return this.todoRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } else {
      return this.todoRepository.find({
        where: {
          user: {
            id: userId,
          },
          status: status,
        },
      });
    }
  }
}
