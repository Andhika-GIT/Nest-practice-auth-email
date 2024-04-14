import { IsNumber, IsString } from 'class-validator';
import { Table, Column, Model  } from 'sequelize-typescript';

@Table({
    tableName: 'product'
})
export class Product extends Model {
    @Column
    name: string

    @Column
    description: string

    @Column
    price: number
}
