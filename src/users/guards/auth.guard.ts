import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CURRENT_USER_KEY } from "src/utils/constant";
import { JwtPayLoadType } from "src/utils/types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService
  ) { }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const [type, token] = await request.headers.authorization?.split(" ") ?? [];
    if (token && type === "Bearer") {
      try {
        const payload: JwtPayLoadType = await this.jwtService.verifyAsync(
          token, {
             secret: this.config.get<string>("JWT_SECRET") 
            }
          );
        request[CURRENT_USER_KEY] = payload;
      }
      catch(error
      ){
        throw new BadRequestException("invalid token")
      }
    }
    else {
      throw new BadRequestException("invalid token")
    }
    return true
  }
}