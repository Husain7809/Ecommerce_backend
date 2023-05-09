import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';
import * as fs from "fs";
import * as path from "path";
import { PRODUCT_ALREADY_EXISTS_MESSAGE, PRODUCT_DELETED_MESSAGE, PRODUCT_NOT_FOUND_MESSAGE, PRODUCT_UPDATED_MESSAGE } from './constraints/constraints';
import { CategoryService } from '../category/category.service';
import { SubCategoryService } from '../sub_category/sub_category.service';
import { PaginationDto } from './dto/pagination.dto';
import { ApiFeatures } from 'src/utils/apiFeatures';
import { ErrorHandler } from 'src/utils/error';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryServices: CategoryService,
    private readonly subCategoryServices: SubCategoryService,
  ) { }


  // create new prodct method
  async create(createProductData: CreateProductDto): Promise<Product | any> {
    try {
      const { category_id, description, image_url, name, price, qty, sub_category_id } = createProductData;
      return await this.productRepository.save({ category_id, description, image_url, name, price, qty, sub_category_id });
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        throw new BadRequestException(PRODUCT_ALREADY_EXISTS_MESSAGE);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  // find all product list with pagination
  async findAll(page: number) {
    try {
      const resultPerPage = 1;

      const query = await this.productRepository.createQueryBuilder('p').where('p.is_active=:is_active', { is_active: true });
      const result = await ApiFeatures.pagination(page, resultPerPage, query);  //pagination method call

      if (!result) {
        return { PRODUCT_NOT_FOUND_MESSAGE };
      }
      return { result };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  // get pruduct by id
  async findOneById(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id, is_active: true } });
  }


  // Check if the product name already exists
  async isProductExist(id: number, name: string): Promise<number | any> {
    try {
      const count = await this.productRepository.createQueryBuilder('p').where('p.id !=:id', { id }).andWhere('p.name=:name', { name }).getCount();
      return count;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: number, updateProduct: UpdateProductDto): Promise<Product | object> {

    const productExits = await this.productRepository.findOne({ where: { id, is_active: true } });

    if (!productExits) {
      return {
        message: PRODUCT_NOT_FOUND_MESSAGE
      }
    }
    const productCount = await this.isProductExist(id, updateProduct.name);

    if (productCount !== 0) {
      throw new BadRequestException("Product is already exits");
    }

    if (productExits.image_url !== null) {
      productExits.image_url.map((val) => {
        const filePath = path.join(__dirname, '../../../files', val);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      })
    }

    const product = new Product();
    product.category_id = updateProduct.category_id;
    product.sub_category_id = updateProduct.sub_category_id;
    product.name = updateProduct.name;
    product.description = updateProduct.description;
    product.price = updateProduct.price;
    product.qty = updateProduct.qty;
    product.image_url = updateProduct.image_url;
    product.is_active = updateProduct.is_active;


    await this.productRepository.update(id, product);
    return {
      message: PRODUCT_UPDATED_MESSAGE
    };
  }

  async remove(id: number): Promise<object> {
    try {
      const result = await this.productRepository.delete(id);
      if (!result) {
        throw new NotFoundException(PRODUCT_NOT_FOUND_MESSAGE);
      }
      return { PRODUCT_DELETED_MESSAGE };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // get the product qty
  async getProduct(product: number): Promise<Product | any> {
    const result = await this.productRepository.findOne({ where: { id: product, is_active: true } });
    return result;
  }

  // // get product by category and subcategory
  // async getProductByCategoryAndSubCategory(param: GetProductDto): Promise<Product[] | any> {
  //   try {
  //     const category = param.category_name;
  //     const subCategory = param.subCategory_name;
  //     const product = param.product_name;

  //     const result = await this.productRepository.createQueryBuilder('product').where('product.name=:product', { product }).getMany();
  //     console.log(result);

  //     return result;
  //   } catch (e) {
  //     throw new InternalServerErrorException(e.message);
  //   }
  // }

  // update product qty
  async updateProductQty(qty: number, id: number): Promise<boolean> {
    try {
      const product = await this.productRepository.update(id, { qty });
      if (product.affected >= 1) {
        return true;
      }
      return false;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // search product by query param 
  async searchByQueryParam(queryParam: string): Promise<Product[]> {
    try {
      const result = await this.productRepository.createQueryBuilder('product').where('product.name LIKE :name', { name: `%${queryParam}%` }).getMany();

      if (result.length === 0) {
        throw new Error('Sorry, no results found!');
      }
      return result;
    } catch (error) {
      const status = error instanceof Error && error.message === 'Sorry, no results found!' ? HttpStatus.NOT_FOUND : error instanceof QueryFailedError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(error.message, status);
    }
  }

}

