import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "src/users/user.service";

@Injectable()
export class ReviewsService{

  constructor(
  ){}
    public getAll(){
      return [
        {reviews: 50},
        {reviews: 60},
        {reviews: 70},
  
      ]
    } 
}