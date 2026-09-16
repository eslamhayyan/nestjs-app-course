import { Controller, Get} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { UserService } from "src/users/user.service";



@Controller()
export class ReviewsController{

  constructor(
    private readonly reviewsService:ReviewsService,
  ){}
  @Get("/api/reviews")
  public getReviews(){
    return this.reviewsService.getAll()
  } 
}