import { BadRequestException, Module } from "@nestjs/common";
import { UploadController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

@Module({
  controllers: [UploadController],
  imports: [MulterModule.register({
      storage: diskStorage({
        destination: "./images",
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
  })]
})

export class UploadsModule{}