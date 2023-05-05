import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

export const config: MysqlConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Husain123',
    database: 'ecommerce_system',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    // autoLoadEntities
}