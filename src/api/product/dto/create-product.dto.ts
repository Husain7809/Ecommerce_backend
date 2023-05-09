import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    category_id: any

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    sub_category_id: any


    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    name: string

    @ApiProperty()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    image_url: Array<string>

    @ApiProperty()
    qty: number

    @ApiProperty()
    @IsNotEmpty()
    price: number

}
