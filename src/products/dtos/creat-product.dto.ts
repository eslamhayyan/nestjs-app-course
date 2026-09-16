import { IsNotEmpty, IsString, IsNumber, Min, Length } from "class-validator";

export class CreatProductDto{

    @IsNotEmpty()
    @IsString()
    @Length(2, 250)
    title!: string;

    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0,{message:'price should not be less than zero!'})
    price!: number;
}