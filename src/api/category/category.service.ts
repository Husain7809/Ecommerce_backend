import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import * as fs from "fs";

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,


  ) { }

  async create(createCategory: CreateCategoryDto): Promise<Category> {
    try {
      const result = await this.categoryRepository.save(createCategory);
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<any> {
    try {
      const result = await this.categoryRepository.find();
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  async findOneByCategory(category_name: string): Promise<object> {
    try {
      const result = await this.categoryRepository.findOne({ where: { name: category_name } });
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const result = await this.categoryRepository.findOne({ where: { id } });
      if (!result) {
        return {
          message: "No record are found"
        }
      }
      return {
        message: result
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: number, updateCategory: UpdateCategoryDto): Promise<any> {
    try {
      const categoryExits = await this.categoryRepository.findOne({ where: { id } });
      if (!categoryExits) {
        return {
          message: "No record are found"
        }
      }
      if (fs.existsSync(categoryExits.image_url)) {
        fs.unlinkSync(categoryExits.image_url)
      }
      const result = await this.categoryRepository.update(id, updateCategory);
      return {
        message: "Category updated successFully"
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const result = await this.categoryRepository.findOne({ where: { id } });
      if (!result) {
        return {
          message: "No record are found"
        }
      }
      await this.categoryRepository.delete(id);
      return {
        message: "category delete successFully"
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}


