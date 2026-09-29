import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
import { ConfigService , ConfigModule} from '@nestjs/config'
import { Review } from './reviews/reviews.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService)=>{
        return {
          type:'postgres',
          database: config.get<string>('DB_DATABASE'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: 'localhost',
          synchronize: process.env.NODE_ENV != 'production',
          entities: [Product, Review, User]
        }
      }
    }),
    UserModule, 
    ProductModule, 
    ReviewsModule
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
