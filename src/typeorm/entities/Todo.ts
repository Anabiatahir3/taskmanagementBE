import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Status } from 'src/enums/status.enum';
import { User } from './User';
@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @Column()
  createdAt: Date;
}
