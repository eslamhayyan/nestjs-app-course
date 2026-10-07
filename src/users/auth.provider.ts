import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtPayLoadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthProvider {

  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
      private readonly mailService: MailService
    ) { }
    
  /**
     * register user
     * @param dto  data used to register user
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
  
    /**
     * login user
     * @param dto  data used to login user
     * @returns JWT (access token)
     */
    public async login(dto: LoginDto) {
      const { email, password } = dto
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new BadRequestException('user name or password are not valid');
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) throw new BadRequestException('user name or password are not valid');
      const accessToken = await this.generateJwt({ id: user.id, userType: user.userType });
      await this.mailService.sendLoginEmail(user.email).catch((error) => {
        console.error("Failed to send login email:", error);
      });
      return { accessToken };
    }

    private generateJwt(payLoad: JwtPayLoadType): Promise<string> {
    return this.jwtService.signAsync(payLoad)
  }
}