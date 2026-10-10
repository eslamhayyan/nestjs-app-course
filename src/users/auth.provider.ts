import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtPayLoadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import {randomBytes} from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dtos/reset-password.dto";

@Injectable()
export class AuthProvider {

  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
      private readonly mailService: MailService,
      private readonly config: ConfigService
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
      const hashedPassword = await this.hashPassword(password);
  
      let newUser = this.userRepository.create({
        email: email,
        password: hashedPassword,
        username: username,
        verificationToken: this.generateVerificationToken()
      });
  
      newUser = await this.userRepository.save(newUser);
      const link = this.genrateLink(newUser.id, newUser.verificationToken!);
      await this.mailService.sendVerifyEmailTemplate(email, link).catch((error) => {
        console.error("Failed to send verification email:", error);
      });

      const accessToken = await this.generateJwt({ id: newUser.id, userType: newUser.userType })
      return { message: "User registered successfully. Please check your email to verify your account."}
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

      if (!user.isAcountVarified) {
        if (!user.verificationToken) {
          user.verificationToken = this.generateVerificationToken();
          await this.userRepository.save(user);
        }
        const link = this.genrateLink(user.id, user.verificationToken!);
        await this.mailService.sendVerifyEmailTemplate(email, link);
        return { message: "Your account is not verified. Please check your email to verify your account." };
}
      const accessToken = await this.generateJwt({ id: user.id, userType: user.userType });
      
      return { accessToken };
    }

    /**
     * send reset password link to user email
     * @param email email of the user to send reset password link
     * @returns response message
     */
    public async sendResetPasswordLink(email: string) {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new BadRequestException("invalid request");
      
      user.resetPasswordToken = this.generateVerificationToken();
      const result= await this.userRepository.save(user);

      const resetPasswordLink = `${this.config.get<string>('DOMAIN_FRONTEND')}/reset-password/${user.id}/${result.resetPasswordToken}`;

      await this.mailService.resetPasswordTemplate(email, resetPasswordLink);
      return { message: "Reset password link has been sent to your email" };
    }


    /**
     * get reset password link
     * @param userId 
     * @param resetPasswordToken 
     * @returns 
     */
    public async getResetPasswordLink(userId: number, resetPasswordToken: string) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException("invalid request");
      if (user.resetPasswordToken === null) throw new NotFoundException("there is no reset password token for this user");
      if (user.resetPasswordToken !== resetPasswordToken) throw new ForbiddenException("invalid request");
      return { message: "Reset password link is valid" };
    }



    /**
     * reset user password
     * @param dto user data used to reset password
     * @returns message indicating password reset success
     */
    public async resetPassword(dto: ResetPasswordDto) {
      const { newPassword, userId, resetPasswordToken } = dto;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException("invalid request");
      if (user.resetPasswordToken === null) throw new NotFoundException("there is no reset password token for this user");
      if (user.resetPasswordToken !== resetPasswordToken) throw new ForbiddenException("invalid request");
      const hashedPassword = await this.hashPassword(newPassword);
      user.resetPasswordToken = null;
      user.password = hashedPassword;
      await this.userRepository.save(user);
      return { message: "Password has been reset successfully" };
    }

    private generateJwt(payload: JwtPayLoadType): Promise<string> {
      return this.jwtService.signAsync(payload);
    }

    generateVerificationToken(): string {
      return randomBytes(32).toString('hex');
    }

    /**
     * generate user varification link
     * @param userId 
     * @param verificationToken 
     * @returns 
     */
    genrateLink(userId: number, verificationToken: string): string {
      return `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${userId}/${verificationToken}`;
    }

    private async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, 10);
    }
  }