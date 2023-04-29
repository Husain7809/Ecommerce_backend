import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseIntPipe, UseGuards, Put, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudConfig } from 'src/helpers/cloudConfig.helper';
import { Product } from './entities/product.entity';
import { v2 } from 'cloudinary';
import * as fs from 'fs';
import { Role } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Product')
@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('product/new')
  @UseInterceptors(FilesInterceptor("product_img", 5))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() file: Array<Express.Multer.File>): Promise<Product | any> {
    const { category_id, sub_category_id, name, description, image_url, qty, price } = createProductDto;

    const productImage = [];
    for (const i of file) {
      productImage.push(i.path);
    }
    return this.productService.create({ category_id, sub_category_id, name, description, image_url: productImage, qty, price });
  }

  @Get('product/')
  findAll(): Promise<Product | any> {
    return this.productService.findAll();
  }

  // @Get(':category/:subCategory')
  // findProductByCategory(@Param('category') category: string, @Param('subCategory') subCategory: string) {
  //   return this.productService.findProductByCategory(category, subCategory);
  // }

  // @Get(':id/:id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.productService.findOne(+id);
  // }


  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('product/:id')
  @UseInterceptors(FilesInterceptor("product_img", 5))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProduct: UpdateProductDto, @UploadedFiles() file: Array<Express.Multer.File>) {
    const { image_url, ...products } = updateProduct;

    const productImage = [];
    for (const i of file) {
      productImage.push(i.path);
    }



    return await this.productService.update(id, { ...products, image_url: productImage });
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('product/:id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.productService.remove(id);
  }
}
