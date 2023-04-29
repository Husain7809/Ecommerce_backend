import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Length, maxLength } from "class-validator"

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    Name: string

    @IsNumber()
    @IsNotEmpty()
    Phone: number

    @IsNumber()
    @IsNotEmpty()
    Pincode: number

    @IsNotEmpty()
    @IsString()
    Address: string

    @IsNotEmpty()
    @IsString()
    City: string

    @IsNotEmpty()
    @IsString()
    State: string

    @IsNotEmpty()
    @IsString()
    Landmark: string

    @Type(() => Number)
    @IsNumber()
    user_id: number
}
