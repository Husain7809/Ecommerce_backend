import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    name: string;

    @IsOptional()
    @ApiProperty()
    image_url: string;


}
