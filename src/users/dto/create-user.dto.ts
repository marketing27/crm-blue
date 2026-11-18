import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsEmail, MinLength } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsNotEmpty()
  role_id: number;
}