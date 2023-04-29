import { Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CART_DELETED_MESSAGE, CART_NOT_FOUND_MESSAGE, CART_QUANTITY_OVER_MESSAGE, PRODUCT_UPDATED_MESSAGE } from './constraints/constraints';
import { PRODUCT_DELETED_MESSAGE, PRODUCT_NOT_FOUND_MESSAGE } from '../product/constraints/constraints';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productServices: ProductService
  ) { }

  async create(createCart: CreateCartDto, user): Promise<Cart | any> {
    try {
      const { qty, product_id } = createCart;

      // get product qty
      const product = await this.productServices.getProductQty(product_id);

      // check the product is exits or not
      const productExists = await this.cartRepository.createQueryBuilder("cart").where("cart.product_id=:product_id", { product_id }).andWhere("cart.user_id=:u_id", { u_id: user.id }).getOne();

      if (product) {

        if (!productExists) {

          // console.log(product.price * createCart.qty);

          const cart = new Cart();
          cart.qty = createCart.qty;
          cart.user_id = user.id;
          cart.product_id = createCart.product_id;
          cart.price = product.price * qty;

          if (product.qty >= qty) {
            const result = await this.cartRepository.create(cart);
            return { cart: await this.cartRepository.save(result) }
          } else {
            return { msg: CART_QUANTITY_OVER_MESSAGE };
          }
        } else {
          if (product.qty >= qty) {
            if (createCart.qty + productExists.qty <= product.qty) {

              const newPrice = productExists.price + (product.price * createCart.qty);  // generate new price

              const cart = new Cart();
              cart.qty = productExists.qty + qty;
              cart.user_id = user.id;
              cart.product_id = createCart.product_id;
              cart.price = newPrice;

              await this.cartRepository.createQueryBuilder().update(cart).set(cart).where("product_id=:product_id", { product_id: product_id }).andWhere('user_id=:u_id', { u_id: user.id }).execute();
              return {
                msg: PRODUCT_UPDATED_MESSAGE
              }
            }
            return {
              msg: CART_QUANTITY_OVER_MESSAGE,
            }
          } else {
            return {
              msg: CART_QUANTITY_OVER_MESSAGE,
            }
          }
        }
      } else {
        return { msg: PRODUCT_NOT_FOUND_MESSAGE }
      }


    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  async findAll(user): Promise<Cart | object> {
    try {
      const result = await this.cartRepository.query(`select c1.id,c1.qty,c1.price,p1.name,p1.description,p1.image_url from cart as c1 inner join product as p1 on c1.product_id=p1.id inner join user as u1 on c1.user_id=u1.id where u1.id=${user.id}`)
      if (result.length <= 0) {
        return { msg: CART_NOT_FOUND_MESSAGE }
      }
      return { msg: result }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // update cart
  async update(id: number, qty: number): Promise<object> {
    try {
      const cart = await this.cartRepository.findOne({ where: { id } });
      if (!cart) {
        return { msg: CART_NOT_FOUND_MESSAGE }
      }

      if (qty == 0) {
        await this.remove(id);
        return { msg: PRODUCT_DELETED_MESSAGE }
      } else {
        const getOriginalPrice = cart.price / cart.qty;
        const res = await this.cartRepository.update(id, { qty, price: (getOriginalPrice * qty) })

        if (res.affected >= 1) {
          return { msg: PRODUCT_UPDATED_MESSAGE }
        }
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // remove cart record
  async remove(id: number): Promise<object> {
    try {
      const cart = await this.cartRepository.findOne({ where: { id } });
      if (!cart) {
        return { msg: CART_NOT_FOUND_MESSAGE }
      }
      const result = await this.cartRepository.delete({ id });
      if (result.affected >= 1) {
        return { msg: CART_DELETED_MESSAGE }
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }


  // find one by id
  async findOneById(id: number): Promise<Cart | any> {
    return this.cartRepository.createQueryBuilder('cart')
      .innerJoin('cart.product_id', 'product')
      .select(['cart.id', 'cart.qty', 'cart.price', 'cart.user_id', 'product.id'])
      .where('cart.id=:id', { id })
      .getRawOne()
      .then(rawCart => {
        return {
          id: rawCart.cart_id,
          qty: rawCart.cart_qty,
          price: rawCart.cart_price,
          user_id: rawCart.cart_user_id,
          product_id: rawCart.product_id
        };
      });
  }

}
