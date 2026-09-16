import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CURRENT_USER_KEY } from "src/utils/constant";
import { JwtPayLoadType } from "src/utils/types";

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JwtPayLoadType = request[CURRENT_USER_KEY];
    return payload;
  }
)