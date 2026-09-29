import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { UpdateDto } from "./dtos/update.dto";
import { JwtPayLoadType } from "src/utils/types";
import { UserType } from "src/utils/enums";
import { AuthProvider } from "./auth.provider";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   * register user
   * @param dto  data used to register user
   * @returns JWT (access token)
   */
  public async register(dto: RegisterDto) {
    return this.authProvider.register(dto);
  }

  /**
   * login user
   * @param dto  data used to login user
   * @returns JWT (access token)
   */
  public async login(dto: LoginDto) {
    return this.authProvider.login(dto);
  }

  /**
   * get current user
   * @param id user ID
   * @returns user object
   */
  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("invalid request");
    return user;
  }

  /**
   * get all users
   * @description only admin can access this route
   * @param none
   * @returns list of users
   */
  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * update user
   * @param id user ID
   * @param updateDto data used to update user
   * @returns updated user object
   */
  public async update(id: number, updateDto: UpdateDto) {
    const { password, username } = updateDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("invalid request");

    user.username = username ?? user.username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await this.userRepository.save(user);
    }

    return user;
  }

  /**
   * delete user
   * @param userId user ID
   * @param payload JWT payload
   * @returns deletion message
   */
  public async delete(userId: number, payload: JwtPayLoadType) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.userRepository.remove(user);
      return { message: "user deleted" };
    }
    throw new ForbiddenException("access denied, you are not allowed");
  }
}