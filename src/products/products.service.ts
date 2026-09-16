import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatProductDto } from "./dtos/creat-product.dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class ProductService{

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>){}


    public CreatProduct(dto: CreatProductDto){
      const newProduct = this.productRepository.create(dto);
      return this.productRepository.save(newProduct);
    }
  
    public getAll(){
      return this.productRepository.find()
    }
  
    public getOneBy(id: number){
      const product = this.productRepository.findOne({where: {id}});
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