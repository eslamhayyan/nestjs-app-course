import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { CreatProductDto } from "./dtos/creat-product.dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { Repository, Like, Between } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/users/user.service";
import { AuthGuard } from "src/users/guards/auth.guard";


@Injectable()
export class ProductService{

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService
  ){}
    
    public async CreatProduct(dto: CreatProductDto, userId: number){
      const user = await this.userService.getCurrentUser(userId);
      const newProduct = this.productRepository.create({
        ...dto,
        title: dto.title.toLowerCase(),
        user
      });
      return this.productRepository.save(newProduct);
    }
  
    public getAll(title?: string, minPrice?: string, maxPrice?: string){
      const filters = {
        ...(title ? {title: Like(`%${title.toLowerCase()}%`)} : {}),
        ...(minPrice && maxPrice ? {price: Between(parseFloat(minPrice), parseFloat(maxPrice))} : {}),
      }
      return this.productRepository.find({ where: filters });
    }
  
    public async getOneBy(id: number): Promise<Product> {
      const product = await this.productRepository.findOne({where: {id}});
      if(!product) throw new NotFoundException("your product not found!");
      return product
    }
  
    public async update(id: number ,dto: UpdateProductDto){
      const product =await this.getOneBy(id)
      product!.title = dto.title ?? product!.title;
      product!.description = dto.description ?? product!.description;
      product!.price = dto.price ?? product!.price;

      return this.productRepository.save(product!);
    }
      
  
    public async delete(id: number){
      const product = await this.getOneBy(id);
      await this.productRepository.remove(product!);
      return{message: 'deleted'}
    }
}