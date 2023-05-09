import { Product } from 'src/api/product/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { AfterInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderStatus } from '../orderStatus.enum';

@Entity()
export class Order extends EntityCommonFiled {
    @ManyToOne(() => User, (user) => user.id, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, (product) => product.id, { eager: false })
    @JoinColumn({
        name: 'product_id'
    })
    product: Product;

    @Column({ type: 'int' })
    qty: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', })
    order_datetime: Date;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}
