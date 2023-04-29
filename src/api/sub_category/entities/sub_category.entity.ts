import { Category } from 'src/api/category/entities/category.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class SubCategory extends EntityCommonFiled {


    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    @ManyToOne(() => Category, (category) => category.id)
    category_id: Category["id"];

    @Column({ type: 'varchar', nullable: true, unique: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    image_url: string;

    @Column({ type: 'varchar', nullable: true, default: true })
    is_active: boolean;
}
