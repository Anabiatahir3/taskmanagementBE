import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/typeorm/entities/Todo';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
