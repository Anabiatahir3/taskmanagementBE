import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
