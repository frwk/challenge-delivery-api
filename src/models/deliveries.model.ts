import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model, HasMany, HasOne } from 'sequelize-typescript';
import User from './users.model';
import Courier from './couriers.model';

@Table({ tableName: 'deliveries', underscored: true })
export default class Delivery extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  pickup: string;

  @Column
  dropoff: string;

  @Column
  pickupDate: Date;

  @Column
  dropoffDate: Date;

  @Column
  confirmationCode: string;

  @Column
  status: string;

  @Column
  notation: number;

  @ForeignKey(() => User)
  @Column
  clientId: number;

  @BelongsTo(() => User)
  client: User;

  @ForeignKey(() => Courier)
  @Column
  courierId: number;

  @BelongsTo(() => Courier)
  courier: Courier;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
