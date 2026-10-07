import { Module } from "@nestjs/common";
import { UploadController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  controllers: [UploadController],
  imports: [MulterModule.register()]
})

export class UploadsModule{}