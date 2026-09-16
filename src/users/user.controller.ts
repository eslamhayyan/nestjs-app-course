import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JwtPayLoadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth.roles.guard";
import { UpdateDto } from "./dtos/update.dto";


@Controller("api/users")
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post("auth/register")
  public register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }

  @Post("auth/login")
  @HttpCode(HttpStatus.OK)
  public login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get("current-user")
  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JwtPayLoadType) {
    const user = this.userService.getCurrentUser(payload.id)
    return user
  }
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.userService.getAll();
  }

  @Put()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(@CurrentUser() payload: JwtPayLoadType, @Body() body: UpdateDto) {
    return this.userService.update(payload.id, body)
  }

  @Delete(":id")
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JwtPayLoadType) {
    return this.userService.delete(id, payload)
  }


}