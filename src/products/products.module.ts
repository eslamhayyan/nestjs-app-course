import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/users/user.module";


@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
})
export class ProductModule{}
