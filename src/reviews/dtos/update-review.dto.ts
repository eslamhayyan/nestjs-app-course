import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateReviewDto{
  @Min(1)
  @Max(5)
  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @MinLength(2)
  @IsOptional()
  comment?: string;
}