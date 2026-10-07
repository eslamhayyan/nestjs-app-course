import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type {Express, Response} from "express";
import { basename, extname, join } from "path";
import { existsSync, mkdirSync } from "fs";

// Ensure the images directory exists
  if (!existsSync("./images")) {
    mkdirSync("./images", { recursive: true });
  }

@Controller("api/uploads")

export class UploadController{

  //Post ~/api/uploads
  @Post()
  @UseInterceptors(FileInterceptor("file", {
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
}))
  uploadFile(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException("File not found");
    }
    console.log(file);
    return {
      message: "File uploaded successfully",
      fileName: file.filename,
      filePath: file.path
    }
  }
  @Get(":image")
  public showUploadedImage(@Param("image") image: string, @Res() res: Response){
    const safeName = basename(image); // Prevent directory traversal attacks
    if (!existsSync(join(process.cwd(), "images", safeName))) {
      throw new NotFoundException("Image not found");
    }
    return res.sendFile(safeName, { root: "./images" });
  }
}