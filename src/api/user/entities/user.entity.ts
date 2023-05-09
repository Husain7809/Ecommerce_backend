import { Role } from 'src/helpers/role.enum';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Double, Entity } from 'typeorm';

@Entity()
export class User extends EntityCommonFiled {
    @Column({ type: 'varchar', nullable: false })
    first_name: string;

    @Column({ type: 'varchar', nullable: false })
    last_name: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @Column({ type: 'varchar', default: true })
    is_active: boolean;

    @Column({ type: 'varchar', nullable: true })
    password_recovery_token: string

    @Column({ nullable: true })
    password_expire_time: Date
}
