import { Body, Controller, Get, Param, UseGuards, Post, ParseIntPipe, Put, Delete } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import type { JwtPayLoadType } from "src/utils/types";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { AuthRolesGuard } from "src/users/guards/auth.roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { UpdateReviewDto } from "./dtos/update-review.dto";



@Controller("/api/reviews")
export class ReviewsController{

  constructor(
    private readonly reviewsService:ReviewsService,
  ){}

  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(
    @Param("pageNumber", ParseIntPipe) pageNumber: number, 
    @Param("reviewsPerPage", ParseIntPipe) reviewsPerPage: number
  ){
    return this.reviewsService.getAllReviews(pageNumber, reviewsPerPage);
  }


  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public createNewReview(
    @Param("productId", ParseIntPipe) productId: number, 
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JwtPayLoadType
  ){
    return this.reviewsService.createReview(payload.id, productId, body)
  }

  @Put(':reviewId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public UpdateReview(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JwtPayLoadType
  ){
    return this.reviewsService.updateReview(reviewId, payload.id, body)
  }

  @Delete(':reviewId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public deleteReview(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @CurrentUser() payload: JwtPayLoadType
  ){
    return this.reviewsService.deleteReview(reviewId, payload)
  }

}