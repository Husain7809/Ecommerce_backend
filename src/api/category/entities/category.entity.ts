import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends EntityCommonFiled {
    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    image_url: string;

    @Column({ type: 'varchar', default: true })
    is_active: boolean;
}
