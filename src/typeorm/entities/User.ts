import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/enums/roles.enum';
import { Exclude } from 'class-transformer';

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
}
