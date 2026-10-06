import { Controller, Get, Post,Body, Param, Put, Delete, ParseIntPipe, UseGuards, Query } from "@nestjs/common";
import { CreatProductDto } from "./dtos/creat-product.dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { ProductService } from "./products.service";
import { AuthRolesGuard } from "src/users/guards/auth.roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JwtPayLoadType } from "src/utils/types";




@Controller("/api/products")
export class ProductController{

  constructor(private readonly productservice: ProductService){}


  /**
   * Creates a new product
   * @param body 
   * @param payload
   * @returns newly created product
   * @description only admin can create product
   */
  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public CreatNewProduct(@Body() body:CreatProductDto, @CurrentUser() payload: JwtPayLoadType){
    return this.productservice.CreatProduct(body, payload.id)
  }


  /**
   * Get all products
   * @returns array of all products
   */
  @Get()
  public getAllProduct(
  @Query("title") title: string, 
  @Query("minPrice") minPrice: string, 
  @Query("maxPrice") maxPrice: string)
  {
    return this.productservice.getAll(title, minPrice, maxPrice)
  }

  /**
   * Get single product by id
   * @param id 
   * @returns product
   */
  @Get("/api/products/:id")
  public getSingleProduct(@Param("id",ParseIntPipe) id: number){
      return this.productservice.getOneBy(id)
  }

  /**
   * update product by id
   * @param id 
   * @param body the data used to update product
   * @description only admin can update product
   * @returns updated product
   * @param body 
   */
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @Put(":id")
  public updateProduct(@Param("id",ParseIntPipe) id: number ,@Body() body: UpdateProductDto){
    this.productservice.update(id, body)
  }

  /**
   * delete product by id
   * @description only admin can delete product
   * @param id 
   */
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @Delete(":id")
  public deleteProduct(@Param("id",ParseIntPipe) id: number){
    this.productservice.delete(id)
  }

}