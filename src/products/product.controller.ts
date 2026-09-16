import { Controller, Get, Post,Body, Param, NotFoundException, Put, Delete, ParseIntPipe } from "@nestjs/common";
import { CreatProductDto } from "./dtos/creat-product.dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { ProductService } from "./products.service";




@Controller("/api/products")
export class ProductController{

  constructor(private readonly productservice: ProductService){}

  @Post()
  public CreatNewProduct(@Body() body:CreatProductDto){
    return this.productservice.CreatProduct(body)
  }

  @Get()
  public getAllProduct(){
    return this.productservice.getAll()
  }

  @Get("/api/products/:id")
  public getSingleProduct(@Param("id",ParseIntPipe) id: number){
    this.productservice.getOneBy(id)
  }

  @Put(":id")
  public updateProduct(@Param("id",ParseIntPipe) id: number ,@Body() body: UpdateProductDto){
    this.productservice.update(id, body)
  }

  @Delete(":id")
  public deleteProduct(@Param("id",ParseIntPipe) id: number){
    this.productservice.delete(id)
  }

}