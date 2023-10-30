import { AutoIncrement, Column, CreatedAt, HasMany, PrimaryKey, Table, UpdatedAt, Model, DataType, Default, Unique } from 'sequelize-typescript';
import Delivery from './deliveries.model';
import { Roles } from '@/enums/roles.enum';

@Table({ tableName: 'users', underscored: true })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Default(Roles.CLIENT)
  @Column(DataType.ENUM(Roles.CLIENT, Roles.COURIER, Roles.ADMIN, Roles.SUPPORT))
  role: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Delivery)
  deliveries: Delivery[];
}
