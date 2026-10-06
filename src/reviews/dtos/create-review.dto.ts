import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto{
  @Min(1)
  @Max(5)
  @IsNumber()
  rating!: number;

  @IsString()
  @MinLength(2)
  comment!: string;
}