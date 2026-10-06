import { forwardRef, Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";
import { UserModule } from "src/users/user.module";
import { ProductModule } from "src/products/products.module";


@Module({
  controllers:[ReviewsController],
  providers:[ReviewsService],
  exports: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review]), UserModule,ProductModule]
})
export class ReviewsModule{}