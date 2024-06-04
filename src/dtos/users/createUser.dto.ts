import { Role } from 'src/enums/roles.enum';
import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
// these dtos are needed for FE validations
export class CreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: Role;
}
