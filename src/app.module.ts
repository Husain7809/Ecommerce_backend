import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { CategoryModule } from './api/category/category.module';
import { SubCategoryModule } from './api/sub_category/sub_category.module';
import { ProductModule } from './api/product/product.module';
import { CartModule } from './api/cart/cart.module';
import { WatchlistModule } from './api/watchlist/watchlist.module';
import { OrderModule } from './api/order/order.module';
import { PaymentModule } from './api/payment/payment.module';
import { AddressModule } from './api/address/address.module';



@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Husain123',
    database: 'ecommerce_system',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
  }), ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }), UserModule, AuthModule, CategoryModule, SubCategoryModule, ProductModule, CartModule, WatchlistModule, OrderModule, PaymentModule, AddressModule]
})
export class AppModule { }
