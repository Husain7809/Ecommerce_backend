import { Category } from 'src/api/category/entities/category.entity';
import { SubCategory } from 'src/api/sub_category/entities/sub_category.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Double, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Product extends EntityCommonFiled {
    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'category_id' })
    category_id: SubCategory;

    @ManyToOne(() => SubCategory, (subCategory) => subCategory.id)
    @JoinColumn({ name: 'sub_category_id' })
    sub_category_id: SubCategory;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'json', nullable: true })
    image_url: string[]

    @Column({ default: 1 })
    qty: number;

    @Column({ type: 'double', nullable: false })
    price: Double;

    @Column({ type: 'varchar', nullable: true, default: true })
    is_active: boolean;

}
