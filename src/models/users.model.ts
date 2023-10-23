import { AutoIncrement, Column, CreatedAt, HasMany, PrimaryKey, Table, UpdatedAt, Model, DataType } from 'sequelize-typescript';
import Delivery from './deliveries.model';
import { Roles } from '@/enums/roles.enum';

@Table({ tableName: 'users' })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @Column(DataType.ENUM(Roles.CLIENT, Roles.COURIER, Roles.ADMIN, Roles.SUPPORT))
  role: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Delivery)
  deliveries: Delivery[];
}
