import { Product } from 'src/api/product/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Watchlist extends EntityCommonFiled {
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product_id: Product;
}
