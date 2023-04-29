import { User } from "src/api/user/entities/user.entity";
import { EntityCommonFiled } from "src/utils/EntityCommonFiled";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Address extends EntityCommonFiled {
    @Column({ type: 'varchar' })
    Name: string

    @Column({ nullable: false })
    Phone: number

    @Column({ nullable: false })
    Pincode: number

    @Column({ type: 'varchar', nullable: false })
    Address: string

    @Column({ type: 'varchar', nullable: false })
    City: string

    @Column({ type: 'varchar', nullable: false })
    State: string

    @Column({ type: 'varchar', nullable: false })
    Landmark: string

    @JoinColumn({ name: "user_id", referencedColumnName: 'id' })
    @ManyToOne(() => User, (user) => user.id)
    user_id: User["id"]

}
