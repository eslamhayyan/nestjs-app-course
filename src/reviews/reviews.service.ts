import { ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { UserService } from "src/users/user.service";
import { Review } from "./reviews.entity";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { Repository } from "typeorm";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JwtPayLoadType } from "src/utils/types";
import { UserType } from "src/utils/enums";

@Injectable()
export class ReviewsService{


  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ){}

    /**
     * 
     * @param pageNumber page number used to paginate the reviews
     * @param reviewsPerPage reviews per page used to paginate the reviews
     * @returns sorted reviews in descending order of creation date with pagination
     */
    public async getAllReviews(pageNumber: number, reviewsPerPage: number){
      return this.reviewRepository.find({
        order: { createdAt: "DESC" },
        skip: (pageNumber - 1) * reviewsPerPage,
        take: reviewsPerPage
      });
    } 

    /**
     * 
     * @param userId used to find the user who is adding the review
     * @param productId used to find the product to which the review is being added 
     * @param dto used to create the review
     * @returns saves the review in the database and returns the review object with userId and productId
     * @throws Error if the user or product is not found
     */
    public async createReview(userId: number, productId: number, dto: CreateReviewDto){
      const user = await this.userService.getCurrentUser(userId);
      const product = await this.productService.getOneBy(productId);
      const review = this.reviewRepository.create({...dto, user, product});
      const result = await this.reviewRepository.save(review);
      return {
        id: result.id,
        comment: result.comment,
        rating: result.rating,
        createdAt: result.createdAt,
        userId: result.user.id,
        productId: result.product.id
      }
    }

    /**
     * 
     * @param reviewId reviewId used to find the review to be updated
     * @param userId userId used to find the user who is updating the review
     * @param dto used to update the review
     * @returns the updated review object
     * @throws Error if the review is not found or the user is not authorized to update it
     */
    public async updateReview(reviewId: number,userId: number, dto: UpdateReviewDto){
      const review = await this.getReviewById(reviewId);
      if(review.user.id !== userId) throw new Error("You are not authorized to update this review");
      review.comment = dto.comment ?? review.comment;
      review.rating = dto.rating ?? review.rating;
      return this.reviewRepository.save(review);
    }

    /**
     * 
     * @param reviewId reviewId used to find the review to be deleted
     * @param payload payload used to find the user who is deleting the review 
     * @returns returns a message indicating that the review has been deleted successfully
     * @throws Error if the review is not found or the user is not authorized to delete it
     */
    public async deleteReview(reviewId: number, payload: JwtPayLoadType){
      const review = await this.getReviewById(reviewId);
      if(review.user.id === payload.id || payload.userType === UserType.NORMAL_USER) {
        await this.reviewRepository.remove(review);
        return {message: "Review deleted successfully"};
      }
      throw new ForbiddenException("You are not authorized to delete this review");
    }

    /**
     * 
     * @param id reviewId used to find the review
     * @returns the review object
     * @throws Error if the review is not found
     */
    private async getReviewById(id: number){
      const review = await this.reviewRepository.findOne({where:{id}});
      if(!review) throw new Error("Review not found");
      return review;
    }
}