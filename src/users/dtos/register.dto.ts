import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class RegisterDto{

  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @Length(2,150)
  @IsOptional()
  username?: string;
}