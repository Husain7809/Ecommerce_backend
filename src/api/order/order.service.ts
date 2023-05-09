import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CANCELE_MESSAGE, DELETED_MESSAGE, NOT_FOUND_MESSAGE, ORDER_QUANTITY_OVER_MESSAGE, UPDATED_MESSAGE } from './constraints/constraints';
import { Product } from '../product/entities/product.entity';
import { CartService } from '../cart/cart.service';
import { OrderStatus } from './orderStatus.enum';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productServices: ProductService,
    private readonly cartServices: CartService

  ) { }


  async create(createOrder: CreateOrderDto) {
    try {
      const { cart_id, user_id } = createOrder;
      const cart = await this.cartServices.findOneById(cart_id);

      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      const order = await this.orderRepository.save({
        product: {
          id: cart.product_id
        },
        user: {
          id: user_id
        },
        qty: cart.qty,
        status: OrderStatus.PENDING,
      })
      const product = await this.productServices.getProduct(cart.product_id);
      await this.productServices.updateProductQty(product.qty - cart.qty, cart.product_id);
      await this.cartServices.remove(cart_id);
      return { order };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(id: number): Promise<Order[] | object> {
    try {
      const order = await this.orderRepository.find({
        where: {
          user: {
            id
          }
        }
      });
      return { order };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: number, updateOrder: UpdateOrderDto): Promise<Order | object> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        return { msg: NOT_FOUND_MESSAGE }
      }
      await this.orderRepository.update(id, { status: updateOrder.status });
      return { msg: UPDATED_MESSAGE }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async remove(id: number): Promise<Order | object> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });

      if (!order) {
        return { msg: NOT_FOUND_MESSAGE }
      }
      await this.orderRepository.delete(id); //delete order
      await this.productServices.updateProductQty(order.qty, order.product.id);  //change product qty

      return { msg: DELETED_MESSAGE }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  async findOneById(id: number) {
    const order = this.orderRepository.createQueryBuilder('order').
      leftJoinAndSelect('order.product', 'product').
      leftJoinAndSelect('order.user', 'user').
      where('order.id=:id', { id }).getOne();
    return order;
  }


  // cancel order by order id
  async cancelOrder(id: number) {
    try {
      const order = await this.orderRepository.update(id, { status: OrderStatus.CANCELED });
      if (order.affected == 0) {
        return { msg: NOT_FOUND_MESSAGE }
      }
      const orderQty = await this.orderRepository.createQueryBuilder('order').leftJoinAndSelect('order.product', 'product').where('order.id=:id', { id }).getOne(); //get order qty
      const updatedQty = orderQty.qty + orderQty.product.qty;

      await this.productServices.updateProductQty(updatedQty, orderQty.product.id);  //update product qty
      return { msg: CANCELE_MESSAGE }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
