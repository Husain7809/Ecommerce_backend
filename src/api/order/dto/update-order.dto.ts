import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../orderStatus.enum';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {

    @IsNotEmpty()
    status: OrderStatus;
}
