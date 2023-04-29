import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateSubCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    name: string;

    @ApiProperty()
    image_url: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNotEmpty()
    category_id: number
}
