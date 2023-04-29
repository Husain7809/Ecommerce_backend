import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateWatchlistDto {

    user_id: number

    @IsNotEmpty()
    @IsNumber()
    product_id: number
}
