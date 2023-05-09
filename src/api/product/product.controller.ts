import { Controller, Get, Post, Body, Query, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseIntPipe, UseGuards, Put, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudConfig } from 'src/helpers/cloudConfig.helper';
import { Product } from './entities/product.entity';
import { v2 } from 'cloudinary';
import * as fs from 'fs';
import { Role } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetProductDto } from './dto/get-product.dto';
import { PaginationDto } from './dto/pagination.dto';
@ApiTags('Product')
@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('product/new')
  @UseInterceptors(FilesInterceptor("product_img", 5))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() file: Array<Express.Multer.File>): Promise<Product | any> {

    createProductDto.image_url = file.map((val) => val.filename);
    return this.productService.create(createProductDto);
  }

  // @Get('product/')
  // findAll(): Promise<Product | any> {
  //   return this.productService.findAll();
  // }

  @Get('product/')
  findAll(@Query('p') query: number): Promise<Product[] | any> {
    return this.productService.findAll(query);
  }

  // @Get(':category/:subCategory')
  // findProductByCategory(@Param('category') category: string, @Param('subCategory') subCategory: string) {
  //   return this.productService.findProductByCategory(category, subCategory);
  // }

  // @Get(':id/:id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.productService.findOne(+id);
  // }

  // // get product by category and subcategory
  // @Get('/:category_name/:subCategory_name/:product_name')
  // async getProductByCategoryAndSubCategory(@Param() param: GetProductDto): Promise<Product[]> {
  //   return this.productService.getProductByCategoryAndSubCategory(param);
  // }


  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('product/:id')
  @UseInterceptors(FilesInterceptor("product_img", 5))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProduct: UpdateProductDto, @UploadedFiles() file: Array<Express.Multer.File>) {

    updateProduct.image_url = file.map((val) => val.filename);
    return await this.productService.update(id, updateProduct);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('product/:id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.productService.remove(id);
  }


  @Get('/search/')
  async search(@Query('q') param: string) {
    return this.productService.searchByQueryParam(param);
  }

}
