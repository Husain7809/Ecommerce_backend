import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './create-sub_category.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
    @ApiProperty()
    is_active: boolean;
}
