import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { SubCategoryController } from './sub_category.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/helpers/fileUpload.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub_category.entity';

@Module({
  imports: [MulterModule.register(multerOptions), TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService]
})
export class SubCategoryModule { }
