import { IsNotEmpty, IsString } from "class-validator"


export class ProductCheckDto {

    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    name: string

}
