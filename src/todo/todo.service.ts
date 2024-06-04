import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/typeorm/entities/Todo';
import { CreateTodoDto } from 'src/dtos/todos/createTodo.dto';
import { EditTodoDto } from 'src/dtos/todos/editTodo.dto';
import { Status } from 'src/enums/status.enum';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}
  async createTodo(createTodo: CreateTodoDto) {
    const newTodo = this.todoRepository.create({
      ...createTodo,
      status: Status.Active,
      createdAt: new Date(),
    });
    return await this.todoRepository.save(newTodo);
  }
  //for toggling the status using this api only
  async editTodo(id: number, editTodo: EditTodoDto) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('No todo found for this id');
    }
    // Update only the properties present in editTodoDto
    Object.assign(todo, editTodo);
    return this.todoRepository.save(todo);
  }

  async deleteTodo(id: number) {
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException('Not found todo');
    }
    this.todoRepository.delete(id);
    return todo;
  }
  async getTodo(id: number) {
    const todo = this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async getAllTodos() {
    return this.todoRepository.find({});
  }
}
