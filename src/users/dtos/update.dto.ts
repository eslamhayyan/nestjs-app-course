import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateDto{

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Optional()
  password?: string;

  @IsString()
  @Length(2,150)
  @IsOptional()
  @Optional()
  username?: string;
}