import { IsNotEmpty, IsNumber } from "class-validator";
import { PaymentStatus } from "../paymentStatus.enum";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsNumber()
    order_id: number
}
