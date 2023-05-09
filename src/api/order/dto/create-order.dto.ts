import { IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { OrderStatus } from "../orderStatus.enum";

export class CreateOrderDto {

    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    cart_id: number;

    qty: number;

    status: OrderStatus;

}
