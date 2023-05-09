import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { Product } from "src/api/product/entities/product.entity";
import { Double } from "typeorm";

export class CreateCartDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    qty: number

    @IsNotEmpty()
    product_id: Product["id"]

    price: Double
}
