import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/helpers/fileUpload.helper';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../sub_category/sub_category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
  forwardRef(() => CategoryModule),
  forwardRef(() => SubCategoryModule),
  MulterModule.register(multerOptions)],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
