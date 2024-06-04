import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from 'src/enums/status.enum';
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

  @Column()
  createdAt: Date;
}
