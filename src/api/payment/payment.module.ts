import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RazorpayModule } from 'nestjs-razorpay/lib/RazorpayModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => OrderModule)
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
