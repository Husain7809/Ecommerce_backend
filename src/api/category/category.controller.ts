import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, Req, Res, UseGuards, UsePipes, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as sharp from 'sharp';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { v2 } from 'cloudinary';
import { CloudConfig } from 'src/helpers/cloudConfig.helper';
import * as fs from 'fs';
import { Category } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/helpers/role.enum';
import { NameGuard } from './guards/name.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/new')
  @UseInterceptors(FileInterceptor('category'))
  async create(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res: Response, @Body() createCategory: CreateCategoryDto): Promise<Category | any> {

    createCategory.image_url = file.filename;
    const { name, image_url } = createCategory;
    return this.categoryService.create({ name, image_url });
  }

  @Get('/')
  findAll(): Promise<Category> {
    return this.categoryService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('category'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategory: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File,): Promise<Category> {

    updateCategory.image_url = file.path;
    const { name, image_url, is_active } = updateCategory;
    return await this.categoryService.update(id, { name, image_url, is_active });
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.remove(id);
  }
}
