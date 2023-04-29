import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { CreateSubCategoryDto } from './dto/create-sub_category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudConfig } from 'src/helpers/cloudConfig.helper';
import { SubCategory } from './entities/sub_category.entity';
import { v2 } from 'cloudinary';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/helpers/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) { }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/new')
  @UseInterceptors(FileInterceptor('subCategory'))
  async createSubCategory(@Body() createSubCategory: CreateSubCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<any> {

    const { name, image_url, category_id } = createSubCategory;
    return await this.subCategoryService.create({ name, image_url: file.path, category_id });
  }

  @Get('/')
  async getSubCategory(): Promise<SubCategory | object> {
    return await this.subCategoryService.find();
  }


  @Get('/:id')
  async findRecordByCategory(@Param('id', ParseIntPipe) category_id: number): Promise<object> {
    return this.subCategoryService.findOne(category_id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:id')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.subCategoryService.delete(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('subCategory'))
  async updateSubCategory(@Param('id', ParseIntPipe) id: number, @Body() updateCategory: UpdateSubCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<SubCategory | object | any> {
    const { name, image_url, category_id, is_active } = updateCategory;
    return await this.subCategoryService.update(id, { name, image_url: file.path, category_id, is_active });
  }


}
