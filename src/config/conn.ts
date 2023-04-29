export default () => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Husain123',
    database: 'ecommerce_system',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
})