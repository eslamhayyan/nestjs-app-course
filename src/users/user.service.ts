import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewsService } from "src/reviews/reviews.service";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayLoadType } from "src/utils/types";
import { UpdateDto } from "./dtos/update.dto";
import { UserType } from "src/utils/enums";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * registing user
   * @param dto  data used to login user
   * @returns JWT (access token)
   */
  public async register(dto: RegisterDto) {
    const { username, email, password } = dto;
    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (userFromDb) throw new BadRequestException("email already exist!");
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = this.userRepository.create({
      email: email,
      password: hashedPassword,
      username: username
    });

    newUser = await this.userRepository.save(newUser);
    const accessToken = await this.generateJwt({ id: newUser.id, userType: newUser.userType })
    return { accessToken };
  }

  public async login(dto: LoginDto) {
    const { email, password } = dto
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('user name or bassword are not valid');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('user name or bassword are not valid');
    const accessToken = await this.generateJwt({ id: user.id, userType: user.userType })
    return { accessToken };
  }

  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) throw new NotFoundException("invalid request")
    return user
  }

  public async getAll(): Promise<User[]>{
    const users = await this.userRepository.find();
    return users
  }

  public async update(id: number, updateDto: UpdateDto){
    const { password, username } = updateDto
    const user = await this.userRepository.findOne({where: {id}})
    user!.username = username ?? user!.username
    if(password){
      user!.password = await bcrypt.hashSync(password, 10)
      this.userRepository.save(user!)
    }
    return user
  }

  public async delete(userId: number, payload: JwtPayLoadType){
    const user = await this.getCurrentUser(userId) 
    if(user.id === payload.id || payload.userType === UserType.ADMIN){
      await this.userRepository.remove(user)
      return {message: 'user deleted'}
    }
    throw new ForbiddenException("access denied, you are not allowed")
  }


  /**
   * generate json web token
   * @param payLoad JWT payload
   * @returns token
   */
  private generateJwt(payLoad: JwtPayLoadType): Promise<string> {
    return this.jwtService.signAsync(payLoad)
  }

}