import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class EditTodoDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
