import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { StringValue } from "ms";
import { AuthProvider } from "./auth.provider";


@Module({
  controllers: [UserController],
  providers: [UserService, AuthProvider],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>{
        return{
          global: true,
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {expiresIn: config.get<string>("JWT_EXPIRES_IN") as StringValue}
        }
      } 

    })
  ]
})
export class UserModule{}