import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../order/order.service';
import { PaymentStatus } from './paymentStatus.enum';
import { Role } from 'src/helpers/role.enum';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderService: OrderService
  ) { }

  async create(createPayment: CreatePaymentDto) {
    try {
      const { order_id } = createPayment;
      const order = await this.orderService.findOneById(order_id);

      if (!order) {
        return { msg: "No record are found" }
      }
      const amount = order.qty * Number(order.product.price);
      const payment = await this.paymentRepository.save({ order: order_id, amount: amount, status: PaymentStatus.SUCCESS });
      return payment;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // get payment record by usre id
  async getPaymentList(user) {
    try {
      if (user.role === Role.Admin) {
        const payment = await this.paymentRepository.find();
        return { payment }
      }
      const payment = await this.paymentRepository.createQueryBuilder('payment')
        .innerJoinAndSelect('payment.order', 'order')
        .innerJoin('order.user', 'user')
        .innerJoinAndSelect('order.product', 'product').where('user.id=:id', { id: user.id }).getMany();
      return { payment }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
