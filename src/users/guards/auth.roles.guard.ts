import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CURRENT_USER_KEY } from "src/utils/constant";
import { JwtPayLoadType } from "src/utils/types";
import { Reflector } from "@nestjs/core";
import { UserType } from "src/utils/enums";
import { UserService } from "../user.service";

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) { }
  async canActivate(context: ExecutionContext) {

    const roles: UserType = this.reflector.getAllAndOverride('roles',[context.getHandler(), context.getClass()]);
    if(!roles || roles.length === 0) return false

    const request = context.switchToHttp().getRequest();
    const [type, token] = await request.headers.authorization?.split(" ") ?? [];
    if (token && type === "Bearer") {
      try {
        const payload: JwtPayLoadType = await this.jwtService.verifyAsync(
          token, {
             secret: this.config.get<string>("JWT_SECRET") 
            }
          );
        const user = await this.userService.getCurrentUser(payload.id)
        if(!user) return false

        if(roles.includes(user.userType))
        request[CURRENT_USER_KEY] = payload;
      return true
      }
      catch(error
      ){
        throw new BadRequestException("invalid token")
      }
    }
    else {
      throw new BadRequestException("invalid token")
    }
  }
}