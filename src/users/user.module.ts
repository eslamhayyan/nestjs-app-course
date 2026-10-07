import { BadRequestException, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { StringValue } from "ms";
import { AuthProvider } from "./auth.provider";
import { extname } from "path";
import { diskStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";
import { MailModule } from "src/mail/mail.module";


@Module({
  controllers: [UserController],
  providers: [UserService, AuthProvider],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>{
        return{
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {expiresIn: config.get<string>("JWT_EXPIRES_IN") as StringValue}
        }
      },
    }),
    MulterModule.register({
        storage: diskStorage({
          destination: './images/users',
          filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const fileExtName = extname(file.originalname);
            const newFileName = `${uniqueSuffix}${fileExtName}`;
            cb(null, newFileName);
          }
        }),
        fileFilter: (req, file, cb) => {
              if(file.mimetype.startsWith("image/")){
                return cb(null, true);
              }
                return cb(new BadRequestException("Only image files are allowed!"), false);
        },
        limits: {
          fileSize: 5 * 1024 * 1024 // 5MB
        }
      }),
      MailModule,
  ]
})
export class UserModule{}