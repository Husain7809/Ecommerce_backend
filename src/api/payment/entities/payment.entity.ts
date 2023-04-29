import { Order } from 'src/api/order/entities/order.entity';
import { EntityCommonFiled } from 'src/utils/EntityCommonFiled';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PaymentStatus } from '../paymentStatus.enum';

@Entity()
export class Payment extends EntityCommonFiled {
    @OneToOne(() => Order, (order) => order.id, { eager: true })
    @JoinColumn({ name: 'order_id' })
    order: number;

    @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
    status: PaymentStatus;

    @Column({ nullable: true })
    amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    payment_datetime: Date;

    // @Column({ type: 'varchar' })
    // razorpay_order_id: string

    // @Column({ type: 'varchar' })
    // razorpay_payment_id: string

    // @Column({ type: 'varchar' })
    // razorpay_signature: string
}
