import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/api/product/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from 'typeorm';



@Entity()
export class Cart extends EntityCommonFiled {
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product_id: Product["id"];

    @Column()
    qty: number;

    @Column()
    price: number;
}
