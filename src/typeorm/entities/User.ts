import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from 'src/enums/roles.enum';
import { Exclude } from 'class-transformer';
import { Todo } from './Todo';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, nullable: true })
  role: Role;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
