import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, IsNumber, Min, Length, IsOptional } from "class-validator";
import { CreatProductDto } from "./creat-product.dto";

export class UpdateProductDto extends CreatProductDto{
}