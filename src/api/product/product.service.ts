import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import * as fs from "fs";
import { PRODUCT_ALREADY_EXISTS_MESSAGE, PRODUCT_DELETED_MESSAGE, PRODUCT_NOT_FOUND_MESSAGE, PRODUCT_UPDATED_MESSAGE } from './constraints/constraints';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryServices: CategoryService,

  ) { }


  // create new prodct method
  async create(createProductData: CreateProductDto): Promise<Product | any> {
    try {
      return await this.productRepository.save(createProductData);
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        throw new BadRequestException(PRODUCT_ALREADY_EXISTS_MESSAGE);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  // find all product list
  async findAll() {
    try {
      const result = await this.productRepository.find({ where: { is_active: true } });
      if (!result) {
        return { PRODUCT_NOT_FOUND_MESSAGE };
      }
      return { result };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  // get pruduct by name
  async findOneByName(productName: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { name: productName, is_active: true } });
  }


  async update(id: number, updateProduct: UpdateProductDto): Promise<Product | object> {
    const productExits = await this.productRepository.findOne({ where: { id } });

    if (!productExits) {
      return {
        message: PRODUCT_NOT_FOUND_MESSAGE
      }
    }
    // Check if the product name already exists
    const product = await this.findOneByName(updateProduct.name);
    if (product) {
      throw new BadRequestException(PRODUCT_ALREADY_EXISTS_MESSAGE);
    }
    if (productExits.image_url !== null) {
      productExits.image_url.map((val) => {
        if (fs.existsSync(val)) {
          fs.unlinkSync(val)
        }
      })
    }
    await this.productRepository.update(id, updateProduct);
    return {
      message: PRODUCT_UPDATED_MESSAGE
    };
  }

  async remove(id: number) {
    try {
      const result = await this.productRepository.delete(id);
      if (!result) {
        return { PRODUCT_NOT_FOUND_MESSAGE };
      }
      return { PRODUCT_DELETED_MESSAGE };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // get the product qty
  async getProductQty(product: number): Promise<Product | any> {
    const result = await this.productRepository.findOne({ where: { id: product, is_active: true } });
    return result;
  }


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
}
