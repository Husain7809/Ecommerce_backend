import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub_category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub_category.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';



@Injectable()
export class SubCategoryService {

    constructor(
        @InjectRepository(SubCategory)
        private readonly subcategooryRepository: Repository<SubCategory>
    ) { }

    // create a sub category
    async create(createSubCategory: CreateSubCategoryDto): Promise<SubCategory | object> {
        try {
            const subCategory = new SubCategory()
            subCategory.name = createSubCategory.name;
            subCategory.image_url = createSubCategory.image_url;
            subCategory.category_id = createSubCategory.category_id;
            const result = await this.subcategooryRepository.save(subCategory);
            return { result };
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // get all sub category 
    async find(): Promise<SubCategory | object> {
        try {
            const result = await this.subcategooryRepository.find();
            if (!result) {
                return {
                    msg: "No Record found"
                };
            }
            return result;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // get all sub category from the category
    async findOne(category_id): Promise<SubCategory[] | object> {
        try {
            const sub_category = await this.subcategooryRepository.createQueryBuilder('subCategory').where("subCategory.category_id=:category_id", { category_id: category_id }).getMany();
            if (sub_category.length === 0) {
                return {
                    msg: "No Record found"
                };
            }
            return sub_category;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // delete sub category 
    async delete(id: number): Promise<object | string> {
        try {
            const subCategoryExits = await this.subcategooryRepository.findOne({ where: { id } });
            if (!subCategoryExits) {
                return {
                    message: "No record are found"
                }
            }
            await this.subcategooryRepository.delete(id);
            return { msg: "Record delete successFully..." }
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }


    // updated sub category
    async update(id: number, updateSubCategory: UpdateSubCategoryDto): Promise<SubCategory | object> {
        try {
            const subCategoryExits = await this.subcategooryRepository.findOne({ where: { id } });
            if (!subCategoryExits) {
                return {
                    message: "No record are found"
                }
            }
            if (fs.existsSync(subCategoryExits.image_url)) {
                fs.unlinkSync(subCategoryExits.image_url)
            }

            const subCategory = new SubCategory();
            subCategory.name = updateSubCategory.name;
            subCategory.image_url = updateSubCategory.image_url;
            subCategory.category_id = updateSubCategory.category_id;
            subCategory.is_active = updateSubCategory.is_active;

            await this.subcategooryRepository.update(id, subCategory);
            return {
                message: "SubCategory updated successFully"
            }
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }


}
